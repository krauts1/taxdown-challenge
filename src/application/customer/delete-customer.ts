import { ICustomerRepository } from '../../domain/repositories/customer.repository';

export class DeleteCustomerUseCase {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async execute(id: string): Promise<void> {
    const exists = await this.customerRepository.exists(id);

    if (!exists) {
      throw new Error('Customer not found');
    }

    await this.customerRepository.delete(id);
  }
}

