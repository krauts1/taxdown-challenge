import { Email } from '../../../src/domain/value-objects/email.vo';

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create a valid email', () => {
      const email = Email.create('test@example.com');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should normalize email to lowercase', () => {
      const email = Email.create('TEST@EXAMPLE.COM');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should trim whitespace', () => {
      const email = Email.create('  test@example.com  ');
      expect(email.getValue()).toBe('test@example.com');
    });

    it('should throw error for empty email', () => {
      expect(() => Email.create('')).toThrow('Email cannot be empty');
      expect(() => Email.create('   ')).toThrow('Email cannot be empty');
    });

    it('should throw error for invalid email format', () => {
      expect(() => Email.create('invalid')).toThrow('Invalid email format');
      expect(() => Email.create('invalid@')).toThrow('Invalid email format');
      expect(() => Email.create('@example.com')).toThrow('Invalid email format');
      expect(() => Email.create('test@')).toThrow('Invalid email format');
    });
  });

  describe('equals', () => {
    it('should return true for same email', () => {
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return true for emails with different case', () => {
      const email1 = Email.create('TEST@EXAMPLE.COM');
      const email2 = Email.create('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = Email.create('test1@example.com');
      const email2 = Email.create('test2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });
  });
});

