import { config } from 'dotenv';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { customerRoutes } from './routes/customer.routes';

config();

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        headers: {
          host: req.headers.host,
          'user-agent': req.headers['user-agent'],
        },
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
  },
});

async function build() {
  await server.register(cors, {
    origin: true,
  });

  await server.register(customerRoutes);

  return server;
}

async function start() {
  try {
    const server = await build();
    const port = Number(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';

    await server.listen({ port, host });
    console.log(`Server listening on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

export { build, start };

