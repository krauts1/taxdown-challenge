# TaxDown Senior Backend Challenge

API REST para gestión de clientes de una tienda online de motocicletas.

## Arquitectura

Usé DDD y Arquitectura Hexagonal. TypeScript con Node.js, Fastify, Prisma y PostgreSQL. Para el deployment usé Serverless Framework.

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
│       ├── http/
│       └── serverless/
├── prisma/
├── tests/
└── serverless.yml
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

Editar `.env` con tu connection string de PostgreSQL:
```
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
PORT=3000
LOG_LEVEL=info
```

4. Generar Prisma Client:
```bash
npm run prisma:generate
```

5. Ejecutar migraciones:
```bash
npm run prisma:migrate
```

6. Iniciar servidor de desarrollo:
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

## Deployment con Serverless Framework

### Prerrequisitos

- AWS CLI configurado
- Credenciales AWS configuradas
- Serverless Framework instalado globalmente (opcional):
```bash
npm install -g serverless
```

### Configuración

1. Configurar variables de entorno en AWS o en `serverless.yml`:
```yaml
environment:
  DATABASE_URL: ${env:DATABASE_URL}
  LOG_LEVEL: ${env:LOG_LEVEL, 'info'}
```

2. Compilar TypeScript:
```bash
npm run build
```

3. Deploy:
```bash
# Deploy a desarrollo
npm run deploy:dev

# Deploy a producción
npm run deploy:prod

# Deploy sin especificar stage
npm run deploy
```

4. Remover deployment:
```bash
npm run remove
```

### Variables de Entorno en AWS

Puedes configurar las variables de varias formas. En serverless.yml como arriba, o usando Parameter Store o Secrets Manager si prefieres.

### Testing Local con Serverless Offline

```bash
# Instalar plugin
npm install -D serverless-offline

# Ejecutar localmente
npx serverless offline
```

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo con hot reload
- `npm run build` - Compilar TypeScript
- `npm run start` - Iniciar servidor en producción
- `npm run prisma:generate` - Generar Prisma Client
- `npm run prisma:migrate` - Ejecutar migraciones
- `npm run prisma:studio` - Abrir Prisma Studio
- `npm test` - Ejecutar tests
- `npm run deploy` - Deploy a AWS Lambda
- `npm run deploy:dev` - Deploy a desarrollo
- `npm run deploy:prod` - Deploy a producción
- `npm run remove` - Remover deployment de AWS

## Tecnologías

- Runtime: Node.js
- Language: TypeScript
- Framework: Fastify
- ORM: Prisma
- Database: PostgreSQL (Supabase)
- Deployment: Serverless Framework + AWS Lambda
- Testing: Jest

