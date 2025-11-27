import { CreateCustomerUseCase } from '../../../src/application/customer/create-customer';
import { ICustomerRepository } from '../../../src/domain/repositories/customer.repository';
import { Customer } from '../../../src/domain/entities/customer.entity';
import { Email } from '../../../src/domain/value-objects/email.vo';

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;
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

    useCase = new CreateCustomerUseCase(mockRepository);
  });

  it('should create a customer successfully', async () => {
    const dto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };

    mockRepository.findByEmail.mockResolvedValue(null);

    const savedCustomer = Customer.create(
      '123',
      dto.firstName,
      dto.lastName,
      Email.create(dto.email)
    );

    mockRepository.save.mockResolvedValue(savedCustomer);

    const result = await useCase.execute(dto);

    expect(mockRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
    expect(result.email).toBe('john@example.com');
    expect(result.availableCredit).toBe(0);
  });

  it('should throw error if email already exists', async () => {
    const dto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'existing@example.com',
    };

    const existingCustomer = Customer.create(
      '123',
      'Jane',
      'Smith',
      Email.create('existing@example.com')
    );

    mockRepository.findByEmail.mockResolvedValue(existingCustomer);

    await expect(useCase.execute(dto)).rejects.toThrow(
      'Customer with this email already exists'
    );

    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});

