jest.mock('../../../../src/infrastructure/http/dependencies', () => ({
  createCustomerUseCase: {
    execute: jest.fn(),
  },
  getCustomerUseCase: {
    execute: jest.fn(),
  },
  updateCustomerUseCase: {
    execute: jest.fn(),
  },
  deleteCustomerUseCase: {
    execute: jest.fn(),
  },
  addCreditUseCase: {
    execute: jest.fn(),
  },
  listCustomersSortedUseCase: {
    execute: jest.fn(),
  },
}));

import {
  createCustomerHandler,
  getCustomerHandler,
  updateCustomerHandler,
  deleteCustomerHandler,
  addCreditHandler,
  listCustomersSortedHandler,
} from '../../../../src/infrastructure/http/handlers/customer.handlers';
import {
  createCustomerUseCase,
  getCustomerUseCase,
  updateCustomerUseCase,
  deleteCustomerUseCase,
  addCreditUseCase,
  listCustomersSortedUseCase,
} from '../../../../src/infrastructure/http/dependencies';

describe('Customer Handlers', () => {
  const mockRequest = {
    body: {},
    params: {},
    query: {},
  } as any;

  const mockReply = {
    code: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCustomerHandler', () => {
    it('should create customer successfully', async () => {
      const customer = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        availableCredit: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (createCustomerUseCase.execute as jest.Mock).mockResolvedValue(customer);
      mockRequest.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };

      await createCustomerHandler(mockRequest, mockReply);

      expect(createCustomerUseCase.execute).toHaveBeenCalledWith(mockRequest.body);
      expect(mockReply.code).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith(customer);
    });

    it('should return 400 on error', async () => {
      (createCustomerUseCase.execute as jest.Mock).mockRejectedValue(
        new Error('Email already exists')
      );
      mockRequest.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
      };

      await createCustomerHandler(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'Email already exists' });
    });
  });

  describe('getCustomerHandler', () => {
    it('should get customer successfully', async () => {
      const customer = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        availableCredit: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (getCustomerUseCase.execute as jest.Mock).mockResolvedValue(customer);
      mockRequest.params = { id: '123' };

      await getCustomerHandler(mockRequest, mockReply);

      expect(getCustomerUseCase.execute).toHaveBeenCalledWith('123');
      expect(mockReply.send).toHaveBeenCalledWith(customer);
    });

    it('should return 404 if customer not found', async () => {
      (getCustomerUseCase.execute as jest.Mock).mockRejectedValue(
        new Error('Customer not found')
      );
      mockRequest.params = { id: '123' };

      await getCustomerHandler(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'Customer not found' });
    });
  });

  describe('updateCustomerHandler', () => {
    it('should update customer successfully', async () => {
      const customer = {
        id: '123',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john@example.com',
        availableCredit: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (updateCustomerUseCase.execute as jest.Mock).mockResolvedValue(customer);
      mockRequest.params = { id: '123' };
      mockRequest.body = { firstName: 'Jane' };

      await updateCustomerHandler(mockRequest, mockReply);

      expect(updateCustomerUseCase.execute).toHaveBeenCalledWith('123', { firstName: 'Jane' });
      expect(mockReply.send).toHaveBeenCalledWith(customer);
    });

    it('should return 400 on error', async () => {
      (updateCustomerUseCase.execute as jest.Mock).mockRejectedValue(
        new Error('Customer not found')
      );
      mockRequest.params = { id: '123' };
      mockRequest.body = { firstName: 'Jane' };

      await updateCustomerHandler(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'Customer not found' });
    });
  });

  describe('deleteCustomerHandler', () => {
    it('should delete customer successfully', async () => {
      (deleteCustomerUseCase.execute as jest.Mock).mockResolvedValue(undefined);
      mockRequest.params = { id: '123' };

      await deleteCustomerHandler(mockRequest, mockReply);

      expect(deleteCustomerUseCase.execute).toHaveBeenCalledWith('123');
      expect(mockReply.code).toHaveBeenCalledWith(204);
      expect(mockReply.send).toHaveBeenCalled();
    });

    it('should return 404 if customer not found', async () => {
      (deleteCustomerUseCase.execute as jest.Mock).mockRejectedValue(
        new Error('Customer not found')
      );
      mockRequest.params = { id: '123' };

      await deleteCustomerHandler(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'Customer not found' });
    });
  });

  describe('addCreditHandler', () => {
    it('should add credit successfully', async () => {
      const customer = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        availableCredit: 50,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      (addCreditUseCase.execute as jest.Mock).mockResolvedValue(customer);
      mockRequest.params = { id: '123' };
      mockRequest.body = { amount: 50 };

      await addCreditHandler(mockRequest, mockReply);

      expect(addCreditUseCase.execute).toHaveBeenCalledWith('123', { amount: 50 });
      expect(mockReply.send).toHaveBeenCalledWith(customer);
    });

    it('should return 400 on error', async () => {
      (addCreditUseCase.execute as jest.Mock).mockRejectedValue(
        new Error('Customer not found')
      );
      mockRequest.params = { id: '123' };
      mockRequest.body = { amount: 50 };

      await addCreditHandler(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'Customer not found' });
    });
  });

  describe('listCustomersSortedHandler', () => {
    it('should return customers sorted', async () => {
      const customers = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          availableCredit: 100,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      (listCustomersSortedUseCase.execute as jest.Mock).mockResolvedValue(customers);
      mockRequest.query = { sort: 'desc' };

      await listCustomersSortedHandler(mockRequest, mockReply);

      expect(listCustomersSortedUseCase.execute).toHaveBeenCalledWith('desc');
      expect(mockReply.send).toHaveBeenCalledWith(customers);
    });

    it('should default to desc if no sort specified', async () => {
      const customers: any[] = [];
      (listCustomersSortedUseCase.execute as jest.Mock).mockResolvedValue(customers);
      mockRequest.query = {};

      await listCustomersSortedHandler(mockRequest, mockReply);

      expect(listCustomersSortedUseCase.execute).toHaveBeenCalledWith('desc');
    });

    it('should return 500 on error', async () => {
      (listCustomersSortedUseCase.execute as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );
      mockRequest.query = { sort: 'desc' };

      await listCustomersSortedHandler(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});

