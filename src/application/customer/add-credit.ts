import { ICustomerRepository } from '../../domain/repositories/customer.repository';
import { AddCreditDto } from '../dtos/add-credit.dto';
import { CustomerResponseDto } from '../dtos/customer-response.dto';
import { CustomerMapper } from './customer.mapper';

export class AddCreditUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: string, dto: AddCreditDto): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    if (dto.amount <= 0) {
      throw new Error('Credit amount must be greater than zero');
    }

    customer.addCredit(dto.amount);

    const updatedCustomer = await this.customerRepository.save(customer);

    return CustomerMapper.toResponseDto(updatedCustomer);
  }
}

