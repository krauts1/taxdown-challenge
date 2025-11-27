import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createCustomerUseCase,
  getCustomerUseCase,
  updateCustomerUseCase,
  deleteCustomerUseCase,
  addCreditUseCase,
  listCustomersSortedUseCase,
} from '../dependencies';

export async function createCustomerHandler(
  request: FastifyRequest<{ Body: { firstName: string; lastName: string; email: string } }>,
  reply: FastifyReply
) {
  try {
    const customer = await createCustomerUseCase.execute(request.body);
    return reply.code(201).send(customer);
  } catch (error: any) {
    return reply.code(400).send({ error: error.message });
  }
}

export async function getCustomerHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const customer = await getCustomerUseCase.execute(request.params.id);
    return reply.send(customer);
  } catch (error: any) {
    return reply.code(404).send({ error: error.message });
  }
}

export async function updateCustomerHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: { firstName?: string; lastName?: string; email?: string };
  }>,
  reply: FastifyReply
) {
  try {
    const customer = await updateCustomerUseCase.execute(request.params.id, request.body);
    return reply.send(customer);
  } catch (error: any) {
    return reply.code(400).send({ error: error.message });
  }
}

export async function deleteCustomerHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    await deleteCustomerUseCase.execute(request.params.id);
    return reply.code(204).send();
  } catch (error: any) {
    return reply.code(404).send({ error: error.message });
  }
}

export async function addCreditHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: { amount: number } }>,
  reply: FastifyReply
) {
  try {
    const customer = await addCreditUseCase.execute(request.params.id, request.body);
    return reply.send(customer);
  } catch (error: any) {
    return reply.code(400).send({ error: error.message });
  }
}

export async function listCustomersSortedHandler(
  request: FastifyRequest<{ Querystring: { sort?: 'asc' | 'desc' } }>,
  reply: FastifyReply
) {
  try {
    const order = (request.query.sort as 'asc' | 'desc') || 'desc';
    const customers = await listCustomersSortedUseCase.execute(order);
    return reply.send(customers);
  } catch (error: any) {
    return reply.code(500).send({ error: error.message });
  }
}

