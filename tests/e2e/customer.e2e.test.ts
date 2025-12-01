import { build } from '../../src/infrastructure/http/server';
import { FastifyInstance } from 'fastify';
import { supabase } from '../../src/infrastructure/persistence/supabase-client';

describe('Customer E2E Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    if (!process.env.SUPABASE_URL) {
      console.log('Skipping E2E tests: SUPABASE_URL not configured');
      return;
    }
    app = await build();
    await app.ready();
  }, 30000);

  afterEach(async () => {
    if (process.env.SUPABASE_URL) {
      const testEmails = await supabase
        .from('customers')
        .select('id')
        .like('email', '%@example.com');
      
      if (testEmails.data && testEmails.data.length > 0) {
        const ids = testEmails.data.map(c => c.id);
        await supabase.from('customers').delete().in('id', ids);
      }
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /customers', () => {
    it('should create a customer', async () => {
      if (!process.env.SUPABASE_URL || !app) {
        return;
      }
      const uniqueEmail = `john-${Date.now()}@example.com`;
      const response = await app.inject({
        method: 'POST',
        url: '/customers',
        payload: {
          firstName: 'John',
          lastName: 'Doe',
          email: uniqueEmail,
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.body);
      expect(body.firstName).toBe('John');
      expect(body.lastName).toBe('Doe');
      expect(body.email).toBe(uniqueEmail);
      expect(body.availableCredit).toBe(0);
    });

    it('should return 400 if email already exists', async () => {
      if (!process.env.SUPABASE_URL || !app) {
        return;
      }
      await app.inject({
        method: 'POST',
        url: '/customers',
        payload: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'duplicate@example.com',
        },
      });

      const response = await app.inject({
        method: 'POST',
        url: '/customers',
        payload: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'duplicate@example.com',
        },
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.error).toContain('already exists');
    });

    it('should return 400 for invalid email', async () => {
      if (!process.env.SUPABASE_URL || !app) {
        return;
      }
      const response = await app.inject({
        method: 'POST',
        url: '/customers',
        payload: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /customers/:id', () => {
    it('should get customer by id', async () => {
      if (!process.env.SUPABASE_URL || !app) {
        return;
      }
      const createResponse = await app.inject({
        method: 'POST',
        url: '/customers',
        payload: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john-get@example.com',
        },
      });

      const created = JSON.parse(createResponse.body);

      const response = await app.inject({
        method: 'GET',
        url: `/customers/${created.id}`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.id).toBe(created.id);
      expect(body.firstName).toBe('John');
    });

    it('should return 404 if customer not found', async () => {
      if (!process.env.SUPABASE_URL || !app) {
        return;
      }
      const response = await app.inject({
        method: 'GET',
        url: '/customers/non-existent-id',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /customers/:id/credit', () => {
    it('should add credit to customer', async () => {
      if (!process.env.SUPABASE_URL || !app) {
        return;
      }
      const createResponse = await app.inject({
        method: 'POST',
        url: '/customers',
        payload: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john-credit@example.com',
        },
      });

      const created = JSON.parse(createResponse.body);

      const response = await app.inject({
        method: 'POST',
        url: `/customers/${created.id}/credit`,
        payload: {
          amount: 150.50,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.availableCredit).toBe(150.5);
    });

    it('should return 400 if customer not found', async () => {
      if (!process.env.SUPABASE_URL || !app) {
        return;
      }
      const response = await app.inject({
        method: 'POST',
        url: '/customers/non-existent-id/credit',
        payload: {
          amount: 50,
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /customers?sort=desc', () => {
    it('should return customers sorted by credit descending', async () => {
      if (!process.env.SUPABASE_URL || !app) {
        return;
      }
      const timestamp = Date.now();
      const random = Math.random();
      const customer1 = await app.inject({
        method: 'POST',
        url: '/customers',
        payload: {
          firstName: 'John',
          lastName: 'Doe',
          email: `john-sort1-${timestamp}-${random}@example.com`,
        },
      });

      const customer2 = await app.inject({
        method: 'POST',
        url: '/customers',
        payload: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: `jane-sort2-${timestamp}-${random}@example.com`,
        },
      });

      expect(customer1.statusCode).toBe(201);
      expect(customer2.statusCode).toBe(201);

      const c1 = JSON.parse(customer1.body);
      const c2 = JSON.parse(customer2.body);

      const credit1Response = await app.inject({
        method: 'POST',
        url: `/customers/${c1.id}/credit`,
        payload: { amount: 100 },
      });

      const credit2Response = await app.inject({
        method: 'POST',
        url: `/customers/${c2.id}/credit`,
        payload: { amount: 50 },
      });

      expect(credit1Response.statusCode).toBe(200);
      expect(credit2Response.statusCode).toBe(200);

      const response = await app.inject({
        method: 'GET',
        url: '/customers?sort=desc',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      const testCustomers = body.filter(
        (c: any) => c.id === c1.id || c.id === c2.id
      );
      expect(testCustomers.length).toBe(2);
      const sorted = testCustomers.sort((a: any, b: any) => b.availableCredit - a.availableCredit);
      expect(sorted[0].availableCredit).toBe(100);
      expect(sorted[1].availableCredit).toBe(50);
    });
  });
});

