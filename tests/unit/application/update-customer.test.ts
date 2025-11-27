import { UpdateCustomerUseCase } from '../../../src/application/customer/update-customer';
import { ICustomerRepository } from '../../../src/domain/repositories/customer.repository';
import { Customer } from '../../../src/domain/entities/customer.entity';
import { Email } from '../../../src/domain/value-objects/email.vo';

describe('UpdateCustomerUseCase', () => {
  let useCase: UpdateCustomerUseCase;
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

    useCase = new UpdateCustomerUseCase(mockRepository);
  });

  it('should update customer first name', async () => {
    const customer = Customer.create(
      '123',
      'John',
      'Doe',
      Email.create('john@example.com')
    );

    mockRepository.findById.mockResolvedValue(customer);
    mockRepository.save.mockResolvedValue(customer);

    const result = await useCase.execute('123', { firstName: 'Jane' });

    expect(customer.getFirstName()).toBe('Jane');
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.firstName).toBe('Jane');
  });

  it('should update customer last name', async () => {
    const customer = Customer.create(
      '123',
      'John',
      'Doe',
      Email.create('john@example.com')
    );

    mockRepository.findById.mockResolvedValue(customer);
    mockRepository.save.mockResolvedValue(customer);

    const result = await useCase.execute('123', { lastName: 'Smith' });

    expect(customer.getLastName()).toBe('Smith');
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.lastName).toBe('Smith');
  });

  it('should update customer email', async () => {
    const customer = Customer.create(
      '123',
      'John',
      'Doe',
      Email.create('john@example.com')
    );

    mockRepository.findById.mockResolvedValue(customer);
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue(customer);

    const result = await useCase.execute('123', { email: 'newemail@example.com' });

    expect(mockRepository.findByEmail).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.email).toBe('newemail@example.com');
  });

  it('should throw error if customer not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('123', { firstName: 'Jane' })).rejects.toThrow(
      'Customer not found'
    );
  });

  it('should throw error if email already in use by another customer', async () => {
    const customer = Customer.create(
      '123',
      'John',
      'Doe',
      Email.create('john@example.com')
    );

    const existingCustomer = Customer.create(
      '456',
      'Jane',
      'Smith',
      Email.create('existing@example.com')
    );

    mockRepository.findById.mockResolvedValue(customer);
    mockRepository.findByEmail.mockResolvedValue(existingCustomer);

    await expect(
      useCase.execute('123', { email: 'existing@example.com' })
    ).rejects.toThrow('Email already in use by another customer');
  });

  it('should allow updating email to same email', async () => {
    const customer = Customer.create(
      '123',
      'John',
      'Doe',
      Email.create('john@example.com')
    );

    mockRepository.findById.mockResolvedValue(customer);
    mockRepository.findByEmail.mockResolvedValue(customer);
    mockRepository.save.mockResolvedValue(customer);

    const result = await useCase.execute('123', { email: 'john@example.com' });

    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.email).toBe('john@example.com');
  });
});

