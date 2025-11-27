import { FastifyInstance } from 'fastify';
import {
  createCustomerSchema,
  getCustomerSchema,
  updateCustomerSchema,
  deleteCustomerSchema,
  addCreditSchema,
  listCustomersSortedSchema,
} from '../schemas/customer.schemas';
import {
  createCustomerHandler,
  getCustomerHandler,
  updateCustomerHandler,
  deleteCustomerHandler,
  addCreditHandler,
  listCustomersSortedHandler,
} from '../handlers/customer.handlers';

export async function customerRoutes(fastify: FastifyInstance) {
  fastify.post('/customers', { schema: createCustomerSchema }, createCustomerHandler);
  fastify.get('/customers/:id', { schema: getCustomerSchema }, getCustomerHandler);
  fastify.put('/customers/:id', { schema: updateCustomerSchema }, updateCustomerHandler);
  fastify.delete('/customers/:id', { schema: deleteCustomerSchema }, deleteCustomerHandler);
  fastify.post('/customers/:id/credit', { schema: addCreditSchema }, addCreditHandler);
  fastify.get('/customers', { schema: listCustomersSortedSchema }, listCustomersSortedHandler);
}

