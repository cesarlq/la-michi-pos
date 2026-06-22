# La Michi POS — Contexto de continuación (handoff)

> Documento para que otra sesión de Claude (o cualquier dev) entienda el estado del
> proyecto y qué sigue. Última actualización: 2026-06-21.

## 1. Qué es esto

Reto técnico para un puesto **Fullstack** (empresa RedEnergy; entregar a
jordi.mas@redenergy.mx). Plazo ~1 semana, esfuerzo ~8–12 h. Es un **Punto de Venta
(POS)** para una paletería mexicana con varias sucursales ("La Michi").

**Entregables:** repo GitHub · app desplegada en AWS (URL + acceso consola) ·
diagrama de arquitectura AWS · ERD · PPT 8–10 slides. (Recordar apagar recursos AWS
tras la revisión.)

**Requisitos del reto:** (1) auth con al menos un rol · (2) CRUD de entidades
principales · (3) al menos una relación entre entidades · (4) listado con filtros ·
(5) vista de resumen/reporte (ventas del día, top sabores, stock crítico) ·
(6) persistencia en BD relacional.

## 2. Arquitectura (DECISIÓN IMPORTANTE: front y back SEPARADOS)

Se descartó un monolito Next.js. El usuario eligió separar para mostrar skills de
backend + escalabilidad + costos (escala a cero).

```
FRONT (Next.js)            BACK (Go + Lambda)              DATOS
┌──────────────┐   fetch   ┌────────────────────┐         ┌──────────┐
│ la-michi-pos │ ────────▶ │ la-michi-pos-api   │ ──────▶ │ Postgres │
│ UI + cookie  │  + JWT    │ 4 Lambdas (chi)    │  pgx    │  (RDS)   │
└──────────────┘           └────────────────────┘         └──────────┘
   S3+CloudFront            API Gateway + Lambda            RDS
```

- **FRONT** `~/Documents/Personal_Proyects/la-michi-pos` — Next.js 16 + React 19 +
  TS + Tailwind v4. Solo UI; consume el API por `fetch` + JWT en cookie httpOnly.
- **BACK** `~/Documents/Personal_Proyects/la-michi-pos-api` — **Go + AWS Lambda +
  SAM + Docker (imagen ECR)**. Patrón calcado de `~/Documents/Personal_Proyects/tasktribe`
  (Go+SAM+Docker, `CMD_PATH` build-arg, base `public.ecr.aws/lambda/provided:al2023-arm64`, arm64).
- **Granularidad: 4 Lambdas POR RECURSO** — `cmd/auth`, `cmd/products`, `cmd/sales`,
  `cmd/reports`. Cada una es un binario Go con **router `chi` interno**.
- **Capa de datos: `sqlc`** (SQL → Go type-safe) sobre **pgx**. Migraciones con
  **golang-migrate**.
- Hubo un intento previo en **NestJS**: descartado, respaldado en
  `la-michi-pos-api-nest-backup/` (NO usar).

## 3. Estado actual — HECHO ✅

### Backend Go (`la-michi-pos-api`)
- Estructura: `cmd/{auth,products,sales,reports}` + `internal/{config,database,token,web,authapi,db}`.
- **`docker-compose.yml`**: Postgres 16 en **puerto 5433** (contenedor `lamichi-api-db`,
  vol `lamichi_api_pgdata`). El back es dueño de su propia BD.
- **Migración** `migrations/000001_init.{up,down}.sql`: 6 tablas (branches, users,
  products, inventory, sales, sale_items) + 4 enums + CHECK constraints. Traducida
  del schema Prisma del front.
- **`seed.sql`** idempotente: 2 sucursales, 3 usuarios (pass `michi123`), 7 productos,
  14 inventarios (2 en stock crítico en Centro). UUIDs FIJOS (ej. branch Centro =
  `11111111-1111-1111-1111-111111111111`).
- **sqlc** (`sqlc.yaml`): uuid→string, timestamptz→time.Time, numeric→string.
  Queries de users en `internal/db/queries/users.sql`. Genera `internal/db/*.go`.
- Paquetes compartidos:
  - `config` — carga `DATABASE_URL`, `JWT_SECRET` del entorno.
  - `database` — pool pgx (`MaxConns 4`, ping al iniciar).
  - `token` — JWT HS256 (golang-jwt v5). Claims: `{sub, name, email, role, branchId}`, exp 8h.
  - `web` — helpers JSON + middleware `Authenticator` (Bearer) + `RequireRole` (los "guards").
- **Lambda `auth`** (`internal/authapi` service+handler): `POST /auth/login`,
  `GET /auth/me`. bcrypt para validar password.
- `cmd/auth/main.go`: corre como **Lambda** (chiadapter `NewV2`/`ProxyWithContextV2`)
  o como **HTTP local** según exista `AWS_LAMBDA_RUNTIME_API`.
- **`Dockerfile`** (multi-stage Go 1.26-alpine → base Lambda arm64, `CMD_PATH` build-arg).
- **`template.yaml`** (SAM): `AuthFunction` PackageType Image, HttpApi `/auth/{proxy+}`,
  params `DatabaseUrl`/`JwtSecret`.
- **PROBADO:** `go test ./...` (token + authapi verde), `go run` local, `sam build` OK,
  `sam local start-api` → login 200 vía API GW emulado (DB con `host.docker.internal:5433`).

### Front (`la-michi-pos`) — slice de AUTH cableado al back
- Se quitó NextAuth del flujo. Ahora:
  - `src/actions/auth.actions.ts` — `authenticate()` hace fetch a `${API_URL}/auth/login`,
    guarda el JWT en **cookie httpOnly** `token`, redirige. `logout()` borra la cookie.
  - `src/lib/jwt.ts` — `verifyToken()` con **jose** + `JWT_SECRET` (mismo secreto que el back).
    Define `TOKEN_COOKIE`, tipo `SessionUser`, `UserRole`.
  - `src/lib/session.ts` — `getSession()` / `getToken()` leen la cookie.
  - `src/lib/auth-guards.ts` — `requireAuth()` / `requireRole()` ahora leen la cookie
    (firma intacta → las páginas no cambian).
  - `src/proxy.ts` — middleware propio (Edge): verifica la cookie con jose, protege rutas.
  - `src/app/page.tsx` — usa `requireAuth()` en vez de `auth()`.
- `.env` del front: agregado `API_URL=http://localhost:4000` y `JWT_SECRET` (igual al back).
- **tsc limpio. Login CONFIRMADO funcionando en el navegador** (2026-06-21) — el flujo
  completo front→back→cookie→dashboard quedó verificado de punta a punta.

## 4. Cómo correr en local

```bash
# 1. BD del back (Postgres 16 en 5433)
cd ~/Documents/Personal_Proyects/la-michi-pos-api
docker compose up -d
# (primera vez) migrar + seed:
migrate -path migrations -database "postgres://lamichi:lamichi_dev@localhost:5433/lamichi_pos?sslmode=disable" up
docker exec -i lamichi-api-db psql -U lamichi -d lamichi_pos < seed.sql

# 2. Back auth (HTTP local en :4000)
PORT=4000 go run ./cmd/auth
#   o como Lambda contenedor real:  sam build && sam local start-api --env-vars env.json --port 4001

# 3. Front
cd ~/Documents/Personal_Proyects/la-michi-pos
npm run dev   # el usuario lo corre; login con dueno@lamichi.com / michi123
```

Usuarios seed (pass `michi123`): `dueno@lamichi.com` (owner, sin sucursal) ·
`encargado@lamichi.com` (manager, Centro) · `empleado@lamichi.com` (employee, Centro).

## 5. Qué sigue — PENDIENTE ⏳ (en orden)

1. ~~Confirmar login en navegador~~ ✅ HECHO (2026-06-21) — funciona end-to-end.
2. **Lambda `products`** ← SIGUIENTE — CRUD REST (`GET/POST/PATCH/DELETE /products`), protegida
   con `Authenticator` + `RequireRole`. **Aquí se decide la representación del dinero**
   (hoy `price` es `numeric`→string en sqlc; exponerlo como número en el JSON).
   El front empieza a leer productos del API en vez de Prisma.
3. **Lambda `sales`** — registrar venta como **transacción atómica** (`Queries.WithTx`):
   crea `sale` + `sale_items` + descuenta `inventory.current_stock`. Precio tomado del
   servidor, no del cliente.
4. **Lambda `reports`** — Req #5: total de ventas del día, top sabores, stock crítico
   (`current_stock <= min_stock`).
5. **Rewire completo del front** → quitar Prisma/`DATABASE_URL` del front; un cliente
   de API (`fetch` que reenvía el Bearer desde la cookie con `getToken()`). Migrar
   `page.tsx` (nombre de sucursal), `products/*`, `sales/*`, services.
6. **Deploy AWS**: Front → S3 + CloudFront · Back → Lambdas contenedor (ECR) tras
   API Gateway vía `sam deploy --guided` · BD → RDS Postgres (+ RDS Proxy opcional).
7. **Entregables**: diagrama de arquitectura AWS · ERD (ya existe en el front,
   `docs/`) · PPT 8–10 slides.

### Patrón para CADA recurso nuevo (replicar el de `auth`)
```
1. Query SQL      → internal/db/queries/<recurso>.sql   → sqlc generate
2. Service        → internal/<recurso>api/service.go    (lógica + tests)
3. Handler        → internal/<recurso>api/handler.go    (HTTP + rutas chi)
4. Lambda main    → cmd/<recurso>/main.go                (igual que cmd/auth)
5. SAM            → agregar Function al template.yaml    (HttpApi /<recurso>/{proxy+})
```

## 6. Convenciones y gotchas

- **Identificadores en inglés, UI en español.** Valores de dominio (`paleta`, `nieve`,
  `agua_fresca`) se quedan en español a propósito.
- **Lógica de negocio en el BACK**, nunca en el front. Componentes = solo presentación.
- **Tests obligatorios** en cada pieza nueva (Go: `_test.go`; front: Vitest + Testing Library).
- **Reglas de seguridad reales** = middleware `RequireRole` en el back, no solo UI.
- **Operaciones destructivas** (rm -rf, --force, reset de BD) → el usuario las corre él,
  NO auto-ejecutar. Entregárselas como comando.
- **Dos BD durante la transición**: front Postgres en **5432** (Prisma, se va a morir),
  back Postgres en **5433** (fuente de verdad). Tienen UUIDs distintos → el nombre de
  sucursal en el dashboard del manager puede salir vacío hasta migrar la data al API.
  **Probar con `dueno@` (owner) para evitar ese desfase.**
- **Limpieza pendiente en el front** (correr cuando el login se confirme): borrar
  `src/auth.ts`, `src/auth.config.ts`, `src/app/api/auth/[...nextauth]/`,
  `src/types/next-auth.d.ts` y la dep `next-auth` de package.json.
- **`numeric`→string** en sqlc: al hacer aritmética de dinero (sales) hay que parsear.
- **Tooling instalado:** Go 1.26, SAM 1.160, Docker, AWS CLI 2, sqlc 1.31, golang-migrate 4.19.
- `env.json` (vars para `sam local`) está gitignored; contiene `host.docker.internal:5433`.

## 7. Archivos clave para orientarse rápido

| Archivo | Qué es |
|---|---|
| `la-michi-pos-api/internal/authapi/{service,handler}.go` | Patrón a replicar para cada recurso |
| `la-michi-pos-api/cmd/auth/main.go` | Cómo se arma una Lambda (Lambda vs HTTP local) |
| `la-michi-pos-api/template.yaml` | Definición SAM (agregar functions aquí) |
| `la-michi-pos-api/migrations/000001_init.up.sql` | Schema completo (el ERD en SQL) |
| `la-michi-pos-api/sqlc.yaml` | Config de generación de código |
| `la-michi-pos/src/lib/{jwt,session,auth-guards}.ts` | Auth del front (cookie + jose) |
| `la-michi-pos/src/actions/auth.actions.ts` | Login/logout contra el API |
| `la-michi-pos/docs/` | ERD.md, erd.png, NOTAS.md (entregables) |
```
