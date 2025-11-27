import { DeleteCustomerUseCase } from '../../../src/application/customer/delete-customer';
import { ICustomerRepository } from '../../../src/domain/repositories/customer.repository';

describe('DeleteCustomerUseCase', () => {
  let useCase: DeleteCustomerUseCase;
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

    useCase = new DeleteCustomerUseCase(mockRepository);
  });

  it('should delete customer', async () => {
    mockRepository.exists.mockResolvedValue(true);
    mockRepository.delete.mockResolvedValue();

    await useCase.execute('123');

    expect(mockRepository.exists).toHaveBeenCalledWith('123');
    expect(mockRepository.delete).toHaveBeenCalledWith('123');
  });

  it('should throw error if customer not found', async () => {
    mockRepository.exists.mockResolvedValue(false);

    await expect(useCase.execute('123')).rejects.toThrow('Customer not found');

    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});

