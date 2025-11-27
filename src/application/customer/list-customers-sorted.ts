import { ICustomerRepository } from '../../domain/repositories/customer.repository';
import { CustomerResponseDto } from '../dtos/customer-response.dto';
import { CustomerMapper } from './customer.mapper';

export class ListCustomersSortedUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(order: 'asc' | 'desc' = 'desc'): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepository.findAllSortedByCredit(order);

    return customers.map((customer) => CustomerMapper.toResponseDto(customer));
  }
}

