import { AddCreditUseCase } from '../../../src/application/customer/add-credit';
import { ICustomerRepository } from '../../../src/domain/repositories/customer.repository';
import { Customer } from '../../../src/domain/entities/customer.entity';
import { Email } from '../../../src/domain/value-objects/email.vo';

describe('AddCreditUseCase', () => {
  let useCase: AddCreditUseCase;
  let mockRepository: jest.Mocked<ICustomerRepository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      findAllSortedByCredit: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    useCase = new AddCreditUseCase(mockRepository);
  });

  it('should add credit to customer', async () => {
    const customer = Customer.create(
      '123',
      'John',
      'Doe',
      Email.create('john@example.com')
    );

    mockRepository.findById.mockResolvedValue(customer);
    mockRepository.save.mockResolvedValue(customer);

    const result = await useCase.execute('123', { amount: 50 });

    expect(customer.getAvailableCredit().getValue()).toBe(50);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.availableCredit).toBe(50);
  });

  it('should throw error if customer not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('123', { amount: 50 })).rejects.toThrow(
      'Customer not found'
    );
  });

  it('should throw error if amount is zero or negative', async () => {
    const customer = Customer.create(
      '123',
      'John',
      'Doe',
      Email.create('john@example.com')
    );

    mockRepository.findById.mockResolvedValue(customer);

    await expect(useCase.execute('123', { amount: 0 })).rejects.toThrow(
      'Credit amount must be greater than zero'
    );

    await expect(useCase.execute('123', { amount: -10 })).rejects.toThrow(
      'Credit amount must be greater than zero'
    );
  });
});

