import { Customer } from '../../domain/entities/customer.entity';
import { CustomerResponseDto } from '../dtos/customer-response.dto';

export class CustomerMapper {
  static toResponseDto(customer: Customer): CustomerResponseDto {
    return {
      id: customer.getId(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      email: customer.getEmail().getValue(),
      availableCredit: customer.getAvailableCredit().getValue(),
      createdAt: customer.getCreatedAt().toISOString(),
      updatedAt: customer.getUpdatedAt().toISOString(),
    };
  }
}

