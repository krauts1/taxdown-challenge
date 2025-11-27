import { ICustomerRepository } from '../../domain/repositories/customer.repository';
import { CustomerResponseDto } from '../dtos/customer-response.dto';
import { CustomerMapper } from './customer.mapper';

export class GetCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: string): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    return CustomerMapper.toResponseDto(customer);
  }
}

