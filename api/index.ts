import { build } from '../src/infrastructure/http/server';
import type { IncomingMessage, ServerResponse } from 'http';

type VercelRequest = IncomingMessage & {
  query?: Record<string, string | string[]>;
  body?: any;
  url?: string;
};

type VercelResponse = ServerResponse;

let app: any;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!app) {
      app = await build();
      await app.ready();
    }

    const url = req.url || '/';
    const method = req.method || 'GET';
    const headers: Record<string, string> = {};
    
    Object.keys(req.headers).forEach((key) => {
      const value = req.headers[key];
      if (value) {
        headers[key] = Array.isArray(value) ? value[0] : value;
      }
    });

    let body: string | undefined = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      if (!headers['content-type']) {
        headers['content-type'] = 'application/json';
      }
    }

    const response = await app.inject({
      method,
      url,
      headers,
      payload: body,
    });

    res.statusCode = response.statusCode;
    
    Object.keys(response.headers).forEach((key) => {
      const value = response.headers[key];
      if (value !== undefined && value !== null) {
        res.setHeader(key, value as string);
      }
    });

    res.end(response.body);
  } catch (error: any) {
    console.error('Error in Vercel handler:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
}

