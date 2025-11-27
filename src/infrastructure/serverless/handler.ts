import { build } from '../http/server';
import awsLambdaFastify from '@fastify/aws-lambda';

let proxy: any;

export const handler = async (event: any, context: any) => {
  if (!proxy) {
    const app = await build();
    proxy = awsLambdaFastify(app);
    await proxy.ready();
  }

  return proxy(event, context);
};

