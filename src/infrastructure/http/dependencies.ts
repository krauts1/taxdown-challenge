import { PrismaCustomerRepository } from '../persistence/prisma-customer.repository';
import {
  CreateCustomerUseCase,
  GetCustomerUseCase,
  UpdateCustomerUseCase,
  DeleteCustomerUseCase,
  AddCreditUseCase,
  ListCustomersSortedUseCase,
} from '../../application/customer';

const customerRepository = new PrismaCustomerRepository();

export const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
export const getCustomerUseCase = new GetCustomerUseCase(customerRepository);
export const updateCustomerUseCase = new UpdateCustomerUseCase(customerRepository);
export const deleteCustomerUseCase = new DeleteCustomerUseCase(customerRepository);
export const addCreditUseCase = new AddCreditUseCase(customerRepository);
export const listCustomersSortedUseCase = new ListCustomersSortedUseCase(customerRepository);

