import { Customer } from '../../../src/domain/entities/customer.entity';
import { Email } from '../../../src/domain/value-objects/email.vo';
import { Credit } from '../../../src/domain/value-objects/credit.vo';

describe('Customer Entity', () => {
  const validId = '123e4567-e89b-12d3-a456-426614174000';
  const validEmail = Email.create('test@example.com');

  describe('create', () => {
    it('should create a customer with valid data', () => {
      const customer = Customer.create(
        validId,
        'John',
        'Doe',
        validEmail
      );

      expect(customer.getId()).toBe(validId);
      expect(customer.getFirstName()).toBe('John');
      expect(customer.getLastName()).toBe('Doe');
      expect(customer.getEmail()).toEqual(validEmail);
      expect(customer.getAvailableCredit().getValue()).toBe(0);
      expect(customer.getCreatedAt()).toBeInstanceOf(Date);
      expect(customer.getUpdatedAt()).toBeInstanceOf(Date);
    });

    it('should trim first and last name', () => {
      const customer = Customer.create(
        validId,
        '  John  ',
        '  Doe  ',
        validEmail
      );

      expect(customer.getFirstName()).toBe('John');
      expect(customer.getLastName()).toBe('Doe');
    });

    it('should throw error for empty first name', () => {
      expect(() => {
        Customer.create(validId, '', 'Doe', validEmail);
      }).toThrow('First name cannot be empty');
    });

    it('should throw error for empty last name', () => {
      expect(() => {
        Customer.create(validId, 'John', '', validEmail);
      }).toThrow('Last name cannot be empty');
    });

    it('should initialize credit to zero', () => {
      const customer = Customer.create(validId, 'John', 'Doe', validEmail);
      expect(customer.getAvailableCredit().getValue()).toBe(0);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute customer from persisted data', () => {
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-02');
      const credit = Credit.create(150.50);

      const customer = Customer.reconstitute(
        validId,
        'John',
        'Doe',
        validEmail,
        credit,
        createdAt,
        updatedAt
      );

      expect(customer.getId()).toBe(validId);
      expect(customer.getAvailableCredit().getValue()).toBe(150.50);
      expect(customer.getCreatedAt()).toEqual(createdAt);
      expect(customer.getUpdatedAt()).toEqual(updatedAt);
    });
  });

  describe('update methods', () => {
    let customer: Customer;

    beforeEach(async () => {
      customer = Customer.create(validId, 'John', 'Doe', validEmail);
    });

    it('should update first name', async () => {
      const oldUpdatedAt = customer.getUpdatedAt();
      await new Promise(resolve => setTimeout(resolve, 10));
      customer.updateFirstName('Jane');
      expect(customer.getFirstName()).toBe('Jane');
      expect(customer.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });

    it('should update last name', async () => {
      const oldUpdatedAt = customer.getUpdatedAt();
      await new Promise(resolve => setTimeout(resolve, 10));
      customer.updateLastName('Smith');
      expect(customer.getLastName()).toBe('Smith');
      expect(customer.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });

    it('should update email', async () => {
      const newEmail = Email.create('newemail@example.com');
      const oldUpdatedAt = customer.getUpdatedAt();
      await new Promise(resolve => setTimeout(resolve, 10));
      customer.updateEmail(newEmail);
      expect(customer.getEmail()).toEqual(newEmail);
      expect(customer.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });

    it('should throw error when updating first name to empty', () => {
      expect(() => customer.updateFirstName('')).toThrow('First name cannot be empty');
    });

    it('should throw error when updating last name to empty', () => {
      expect(() => customer.updateLastName('')).toThrow('Last name cannot be empty');
    });
  });

  describe('credit operations', () => {
    let customer: Customer;

    beforeEach(() => {
      customer = Customer.create(validId, 'John', 'Doe', validEmail);
    });

    it('should add credit', async () => {
      const oldUpdatedAt = customer.getUpdatedAt();
      await new Promise(resolve => setTimeout(resolve, 10));
      customer.addCredit(50);
      expect(customer.getAvailableCredit().getValue()).toBe(50);
      expect(customer.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });

    it('should subtract credit', async () => {
      customer.addCredit(100);
      const oldUpdatedAt = customer.getUpdatedAt();
      await new Promise(resolve => setTimeout(resolve, 10));
      customer.subtractCredit(30);
      expect(customer.getAvailableCredit().getValue()).toBe(70);
      expect(customer.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
    });
  });

  describe('getFullName', () => {
    it('should return full name', () => {
      const customer = Customer.create(validId, 'John', 'Doe', validEmail);
      expect(customer.getFullName()).toBe('John Doe');
    });
  });
});

