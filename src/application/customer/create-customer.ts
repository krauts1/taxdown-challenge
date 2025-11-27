import { Customer } from '../../domain/entities/customer.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { ICustomerRepository } from '../../domain/repositories/customer.repository';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CustomerResponseDto } from '../dtos/customer-response.dto';
import { CustomerMapper } from './customer.mapper';
import { randomUUID } from 'crypto';

export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const email = Email.create(dto.email);

    const existingCustomer = await this.customerRepository.findByEmail(
      email.getValue()
    );

    if (existingCustomer) {
      throw new Error('Customer with this email already exists');
    }

    const customer = Customer.create(
      randomUUID(),
      dto.firstName,
      dto.lastName,
      email
    );

    const savedCustomer = await this.customerRepository.save(customer);

    return CustomerMapper.toResponseDto(savedCustomer);
  }
}

