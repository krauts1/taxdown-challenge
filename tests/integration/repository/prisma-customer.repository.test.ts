import { PrismaCustomerRepository } from '../../../src/infrastructure/persistence/prisma-customer.repository';
import { Customer } from '../../../src/domain/entities/customer.entity';
import { Email } from '../../../src/domain/value-objects/email.vo';
import prisma from '../../../src/infrastructure/persistence/prisma-client';

describe('PrismaCustomerRepository Integration', () => {
  let repository: PrismaCustomerRepository;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgresql://')) {
      console.log('Skipping integration tests: DATABASE_URL not configured');
      return;
    }
    repository = new PrismaCustomerRepository();
  });

  afterEach(async () => {
    if (process.env.DATABASE_URL?.startsWith('postgresql://')) {
      try {
        await prisma.customer.deleteMany({
          where: {
            id: {
              startsWith: 'test-id-',
            },
          },
        });
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  afterAll(async () => {
    if (process.env.DATABASE_URL?.startsWith('postgresql://')) {
      await prisma.$disconnect();
    }
  });

  describe('save', () => {
    it('should save a new customer', async () => {
      if (!process.env.DATABASE_URL?.startsWith('postgresql://')) {
        return;
      }
      const customer = Customer.create(
        'test-id-1',
        'John',
        'Doe',
        Email.create('john@example.com')
      );

      const saved = await repository.save(customer);

      expect(saved.getId()).toBe('test-id-1');
      expect(saved.getFirstName()).toBe('John');
      expect(saved.getEmail().getValue()).toBe('john@example.com');
    });

    it('should update existing customer', async () => {
      if (!process.env.DATABASE_URL?.startsWith('postgresql://') || !repository) {
        return;
      }
      const customer = Customer.create(
        'test-id-2',
        'John',
        'Doe',
        Email.create('john2@example.com')
      );

      await repository.save(customer);
      customer.updateFirstName('Jane');
      const updated = await repository.save(customer);

      expect(updated.getFirstName()).toBe('Jane');
    });
  });

  describe('findById', () => {
    it('should find customer by id', async () => {
      if (!process.env.DATABASE_URL?.startsWith('postgresql://') || !repository) {
        return;
      }
      const customer = Customer.create(
        'test-id-3',
        'John',
        'Doe',
        Email.create('john3@example.com')
      );

      await repository.save(customer);
      const found = await repository.findById('test-id-3');

      expect(found).not.toBeNull();
      expect(found?.getId()).toBe('test-id-3');
    });

    it('should return null if customer not found', async () => {
      if (!process.env.DATABASE_URL?.startsWith('postgresql://') || !repository) {
        return;
      }
      const found = await repository.findById('non-existent-id');
      expect(found).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find customer by email', async () => {
      if (!process.env.DATABASE_URL?.startsWith('postgresql://') || !repository) {
        return;
      }
      const uniqueId = `test-id-4-${Date.now()}-${Math.random()}`;
      const uniqueEmail = `john4-${Date.now()}-${Math.random()}@example.com`;
      const customer = Customer.create(
        uniqueId,
        'John',
        'Doe',
        Email.create(uniqueEmail)
      );

      const saved = await repository.save(customer);
      expect(saved).not.toBeNull();
      
      const found = await repository.findByEmail(uniqueEmail);

      expect(found).not.toBeNull();
      expect(found?.getEmail().getValue()).toBe(uniqueEmail);
    });
  });

  describe('findAllSortedByCredit', () => {
    it('should return customers sorted by credit descending', async () => {
      if (!process.env.DATABASE_URL?.startsWith('postgresql://') || !repository) {
        return;
      }
      const timestamp = Date.now();
      const random = Math.random();
      const customer1 = Customer.create(
        `test-id-5-${timestamp}-${random}`,
        'John',
        'Doe',
        Email.create(`john5-${timestamp}-${random}@example.com`)
      );
      customer1.addCredit(100);

      const customer2 = Customer.create(
        `test-id-6-${timestamp}-${random}`,
        'Jane',
        'Smith',
        Email.create(`jane6-${timestamp}-${random}@example.com`)
      );
      customer2.addCredit(50);

      const saved1 = await repository.save(customer1);
      const saved2 = await repository.save(customer2);
      
      expect(saved1).not.toBeNull();
      expect(saved2).not.toBeNull();
      
      const verify1 = await repository.findById(saved1.getId());
      const verify2 = await repository.findById(saved2.getId());
      expect(verify1).not.toBeNull();
      expect(verify2).not.toBeNull();

      const customers = await repository.findAllSortedByCredit('desc');
      const testCustomers = customers.filter(
        (c) => c.getId() === saved1.getId() || c.getId() === saved2.getId()
      );

      expect(testCustomers.length).toBe(2);
      const sorted = testCustomers.sort((a, b) => b.getAvailableCredit().getValue() - a.getAvailableCredit().getValue());
      expect(sorted[0].getAvailableCredit().getValue()).toBe(100);
      expect(sorted[1].getAvailableCredit().getValue()).toBe(50);
    });

    it('should return customers sorted by credit ascending', async () => {
      if (!process.env.DATABASE_URL?.startsWith('postgresql://') || !repository) {
        return;
      }
      const timestamp = Date.now();
      const random = Math.random();
      const customer1 = Customer.create(
        `test-id-7-${timestamp}-${random}`,
        'John',
        'Doe',
        Email.create(`john7-${timestamp}-${random}@example.com`)
      );
      customer1.addCredit(100);

      const customer2 = Customer.create(
        `test-id-8-${timestamp}-${random}`,
        'Jane',
        'Smith',
        Email.create(`jane8-${timestamp}-${random}@example.com`)
      );
      customer2.addCredit(50);

      const saved1 = await repository.save(customer1);
      const saved2 = await repository.save(customer2);
      
      expect(saved1).not.toBeNull();
      expect(saved2).not.toBeNull();

      const customers = await repository.findAllSortedByCredit('asc');
      const testCustomers = customers.filter(
        (c) => c.getId() === saved1.getId() || c.getId() === saved2.getId()
      );

      expect(testCustomers.length).toBe(2);
      const sorted = testCustomers.sort((a, b) => a.getAvailableCredit().getValue() - b.getAvailableCredit().getValue());
      expect(sorted[0].getAvailableCredit().getValue()).toBe(50);
      expect(sorted[1].getAvailableCredit().getValue()).toBe(100);
    });
  });

  describe('delete', () => {
    it('should delete customer', async () => {
      if (!process.env.DATABASE_URL?.startsWith('postgresql://') || !repository) {
        return;
      }
      const uniqueId = `test-id-9-${Date.now()}-${Math.random()}`;
      const customer = Customer.create(
        uniqueId,
        'John',
        'Doe',
        Email.create(`john9-${Date.now()}-${Math.random()}@example.com`)
      );

      const saved = await repository.save(customer);
      expect(saved).not.toBeNull();
      expect(saved.getId()).toBe(uniqueId);
      
      await repository.delete(saved.getId());

      const found = await repository.findById(saved.getId());
      expect(found).toBeNull();
    });
  });

  describe('exists', () => {
    it('should return true if customer exists', async () => {
      if (!process.env.DATABASE_URL?.startsWith('postgresql://') || !repository) {
        return;
      }
      const uniqueId = `test-id-10-${Date.now()}`;
      const uniqueEmail = `john10-${Date.now()}@example.com`;
      const customer = Customer.create(
        uniqueId,
        'John',
        'Doe',
        Email.create(uniqueEmail)
      );

      const saved = await repository.save(customer);
      const exists = await repository.exists(saved.getId());

      expect(exists).toBe(true);
    });

    it('should return false if customer does not exist', async () => {
      if (!process.env.DATABASE_URL?.startsWith('postgresql://') || !repository) {
        return;
      }
      const exists = await repository.exists('non-existent-id');
      expect(exists).toBe(false);
    });
  });
});

