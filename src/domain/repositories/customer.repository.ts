import { Customer } from '../entities/customer.entity';

export interface ICustomerRepository {
  save(customer: Customer): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findAll(): Promise<Customer[]>;
  findAllSortedByCredit(order: 'asc' | 'desc'): Promise<Customer[]>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

