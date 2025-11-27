import { Email } from '../../domain/value-objects/email.vo';
import { ICustomerRepository } from '../../domain/repositories/customer.repository';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { CustomerResponseDto } from '../dtos/customer-response.dto';
import { CustomerMapper } from './customer.mapper';

export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: string, dto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      throw new Error('Customer not found');
    }

    if (dto.firstName !== undefined) {
      customer.updateFirstName(dto.firstName);
    }

    if (dto.lastName !== undefined) {
      customer.updateLastName(dto.lastName);
    }

    if (dto.email !== undefined) {
      const email = Email.create(dto.email);
      const existingCustomer = await this.customerRepository.findByEmail(
        email.getValue()
      );

      if (existingCustomer && existingCustomer.getId() !== id) {
        throw new Error('Email already in use by another customer');
      }

      customer.updateEmail(email);
    }

    const updatedCustomer = await this.customerRepository.save(customer);

    return CustomerMapper.toResponseDto(updatedCustomer);
  }
}

