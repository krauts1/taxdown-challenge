import { ListCustomersSortedUseCase } from '../../../src/application/customer/list-customers-sorted';
import { ICustomerRepository } from '../../../src/domain/repositories/customer.repository';
import { Customer } from '../../../src/domain/entities/customer.entity';
import { Email } from '../../../src/domain/value-objects/email.vo';

describe('ListCustomersSortedUseCase', () => {
  let useCase: ListCustomersSortedUseCase;
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

    useCase = new ListCustomersSortedUseCase(mockRepository);
  });

  it('should return customers sorted by credit descending', async () => {
    const customer1 = Customer.create(
      '1',
      'John',
      'Doe',
      Email.create('john@example.com')
    );
    customer1.addCredit(100);

    const customer2 = Customer.create(
      '2',
      'Jane',
      'Smith',
      Email.create('jane@example.com')
    );
    customer2.addCredit(50);

    mockRepository.findAllSortedByCredit.mockResolvedValue([customer1, customer2]);

    const result = await useCase.execute('desc');

    expect(mockRepository.findAllSortedByCredit).toHaveBeenCalledWith('desc');
    expect(result.length).toBe(2);
    expect(result[0].availableCredit).toBe(100);
    expect(result[1].availableCredit).toBe(50);
  });

  it('should return customers sorted by credit ascending', async () => {
    const customer1 = Customer.create(
      '1',
      'John',
      'Doe',
      Email.create('john@example.com')
    );
    customer1.addCredit(100);

    const customer2 = Customer.create(
      '2',
      'Jane',
      'Smith',
      Email.create('jane@example.com')
    );
    customer2.addCredit(50);

    mockRepository.findAllSortedByCredit.mockResolvedValue([customer2, customer1]);

    const result = await useCase.execute('asc');

    expect(mockRepository.findAllSortedByCredit).toHaveBeenCalledWith('asc');
    expect(result.length).toBe(2);
    expect(result[0].availableCredit).toBe(50);
    expect(result[1].availableCredit).toBe(100);
  });

  it('should default to descending order', async () => {
    const customer = Customer.create(
      '1',
      'John',
      'Doe',
      Email.create('john@example.com')
    );

    mockRepository.findAllSortedByCredit.mockResolvedValue([customer]);

    await useCase.execute();

    expect(mockRepository.findAllSortedByCredit).toHaveBeenCalledWith('desc');
  });
});

