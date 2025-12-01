import { VercelRequest, VercelResponse } from '@vercel/node';
import { build } from '../src/infrastructure/http/server';

let server: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!server) {
    server = await build();
    await server.ready();
  }

  const response = await server.inject({
    method: req.method || 'GET',
    url: req.url || '/',
    headers: req.headers as any,
    payload: req.body,
    query: req.query as any,
  });

  res.status(response.statusCode);
  
  Object.keys(response.headers).forEach(key => {
    res.setHeader(key, response.headers[key]);
  });

  res.send(response.payload);
}

