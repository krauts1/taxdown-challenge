# TaxDown Senior Backend Challenge

API REST para gestión de clientes de una tienda online de motocicletas.

## Arquitectura

Usé DDD y Arquitectura Hexagonal. TypeScript con Node.js, Fastify, Supabase Client y PostgreSQL. Para el deployment usé Vercel.

## Estructura del Proyecto

```
challenge_taxdown/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   ├── value-objects/
│   │   └── repositories/
│   ├── application/
│   │   ├── customer/
│   │   └── dtos/
│   └── infrastructure/
│       ├── persistence/
│       └── http/
├── api/
├── tests/
└── vercel.json
```

## Setup Local

### Prerrequisitos

- Node.js 20.x o superior
- PostgreSQL (puedes usar Supabase)
- npm o yarn

### Instalación

1. Clonar el repositorio:
```bash
git clone <repo-url>
cd challenge_taxdown
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de Supabase:
```
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
PORT=3000
LOG_LEVEL=info
```

Para obtener las credenciales, ve a tu proyecto en Supabase Dashboard -> Settings -> API

4. Crear la tabla en Supabase (si no existe):

Si ya tienes la tabla creada desde Prisma, puedes saltar este paso.

**Opción A: Desde Supabase Dashboard (Recomendado)**
1. Ve a tu proyecto en Supabase Dashboard
2. Ve a **SQL Editor**
3. Copia y pega el contenido de `supabase/migrations/001_create_customers_table.sql`
4. Ejecuta el query

**Opción B: Desde Supabase CLI**
```bash
npm install -g supabase
supabase login
supabase link --project-ref tu-project-ref
supabase db push
```

5. Iniciar servidor de desarrollo:
```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`

## Endpoints

### Customer Management

- `POST /customers` - Crear cliente
- `GET /customers/:id` - Obtener cliente por ID
- `PUT /customers/:id` - Actualizar cliente
- `DELETE /customers/:id` - Eliminar cliente
- `POST /customers/:id/credit` - Agregar crédito disponible
- `GET /customers?sort=desc` - Listar clientes ordenados por crédito

### Ejemplo de Request

```bash
# Crear cliente
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }'

# Agregar crédito
curl -X POST http://localhost:3000/customers/{id}/credit \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 150.50
  }'

# Listar ordenados por crédito
curl http://localhost:3000/customers?sort=desc
```

## Testing

Tengo tests unitarios, de integración y E2E con Jest.

### Ejecutar Tests

```bash
# Todos los tests
npm test

# Modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

### Tests por Tipo

Si quieres ejecutar solo un tipo de test:

```bash
# Unitarios
npm test -- --testPathPattern="unit"

# Integración
npm test -- --testPathPattern="integration"

# E2E
npm test -- --testPathPattern="e2e"
```

### Coverage

Tengo un coverage del 90.45%. Las capas principales están al 100%:

- Domain Layer: 100%
- Application Layer: 100%
- Infrastructure/Handlers: 100%
- Infrastructure/Routes: 100%
- Infrastructure/Schemas: 100%

Para ver el reporte HTML:
```bash
npm run test:coverage
# Abre coverage/index.html
```

### Problema con Tests en Paralelo

Si ejecutas todos los tests juntos con `npm test`, algunos de integración y E2E pueden fallar. Esto pasa porque se ejecutan en paralelo y compiten por la misma base de datos.

Para evitar esto:

1. Ejecuta tests por tipo:
```bash
npm test -- --testPathPattern="unit"
npm test -- --testPathPattern="integration"
npm test -- --testPathPattern="e2e"
```

2. O ejecuta en serie (más lento):
```bash
npm test -- --runInBand
```

3. O ejecuta un test específico:
```bash
npm test -- tests/unit/application/create-customer.test.ts
```

Los unitarios siempre pasan. Los de integración y E2E necesitan la BD configurada. Si no tienes `DATABASE_URL`, se saltan automáticamente.

## Deployment con Vercel

### Prerrequisitos

- Cuenta de Vercel (gratuita)
- Vercel CLI instalado (opcional):
```bash
npm install -g vercel
```

### Configuración

1. Configurar variables de entorno en Vercel:
   - Ve a tu proyecto en Vercel Dashboard
   - Settings -> Environment Variables
   - Agrega:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (opcional)
     - `LOG_LEVEL` (opcional)

2. Deploy:
```bash
# Deploy usando Vercel CLI
vercel

# Deploy a producción
vercel --prod
```

O conecta tu repositorio de GitHub en Vercel Dashboard para deploy automático en cada push.

### Variables de Entorno

Configura las variables de entorno en Vercel Dashboard -> Settings -> Environment Variables. Las variables se aplican automáticamente en cada deploy.

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo con hot reload
- `npm run build` - Compilar TypeScript
- `npm run start` - Iniciar servidor en producción
- `npm test` - Ejecutar tests
- `npm run vercel-build` - Build para Vercel

## Tecnologías

- Runtime: Node.js
- Language: TypeScript
- Framework: Fastify
- Database Client: Supabase Client
- Database: PostgreSQL (Supabase)
- Deployment: Vercel
- Testing: Jest

