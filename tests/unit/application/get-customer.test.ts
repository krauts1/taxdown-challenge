import { GetCustomerUseCase } from '../../../src/application/customer/get-customer';
import { ICustomerRepository } from '../../../src/domain/repositories/customer.repository';
import { Customer } from '../../../src/domain/entities/customer.entity';
import { Email } from '../../../src/domain/value-objects/email.vo';

describe('GetCustomerUseCase', () => {
  let useCase: GetCustomerUseCase;
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

    useCase = new GetCustomerUseCase(mockRepository);
  });

  it('should get customer by id', async () => {
    const customer = Customer.create(
      '123',
      'John',
      'Doe',
      Email.create('john@example.com')
    );

    mockRepository.findById.mockResolvedValue(customer);

    const result = await useCase.execute('123');

    expect(mockRepository.findById).toHaveBeenCalledWith('123');
    expect(result.id).toBe('123');
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
  });

  it('should throw error if customer not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('123')).rejects.toThrow('Customer not found');
  });
});

