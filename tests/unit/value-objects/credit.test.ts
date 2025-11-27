import { Credit } from '../../../src/domain/value-objects/credit.vo';

describe('Credit Value Object', () => {
  describe('create', () => {
    it('should create a valid credit', () => {
      const credit = Credit.create(100);
      expect(credit.getValue()).toBe(100);
    });

    it('should round to 2 decimal places', () => {
      const credit1 = Credit.create(100.999);
      expect(credit1.getValue()).toBe(101);

      const credit2 = Credit.create(100.123);
      expect(credit2.getValue()).toBe(100.12);
    });

    it('should throw error for negative amount', () => {
      expect(() => Credit.create(-1)).toThrow('Credit cannot be negative');
      expect(() => Credit.create(-0.01)).toThrow('Credit cannot be negative');
    });
  });

  describe('zero', () => {
    it('should create zero credit', () => {
      const credit = Credit.zero();
      expect(credit.getValue()).toBe(0);
    });
  });

  describe('add', () => {
    it('should add amount to credit', () => {
      const credit = Credit.create(100);
      const newCredit = credit.add(50);
      expect(newCredit.getValue()).toBe(150);
    });

    it('should create new instance (immutability)', () => {
      const credit = Credit.create(100);
      const newCredit = credit.add(50);
      expect(credit.getValue()).toBe(100);
      expect(newCredit.getValue()).toBe(150);
    });
  });

  describe('subtract', () => {
    it('should subtract amount from credit', () => {
      const credit = Credit.create(100);
      const newCredit = credit.subtract(30);
      expect(newCredit.getValue()).toBe(70);
    });

    it('should create new instance (immutability)', () => {
      const credit = Credit.create(100);
      const newCredit = credit.subtract(30);
      expect(credit.getValue()).toBe(100);
      expect(newCredit.getValue()).toBe(70);
    });
  });

  describe('equals', () => {
    it('should return true for same credit', () => {
      const credit1 = Credit.create(100);
      const credit2 = Credit.create(100);
      expect(credit1.equals(credit2)).toBe(true);
    });

    it('should return false for different credits', () => {
      const credit1 = Credit.create(100);
      const credit2 = Credit.create(200);
      expect(credit1.equals(credit2)).toBe(false);
    });
  });

  describe('comparisons', () => {
    it('should compare credits correctly', () => {
      const credit1 = Credit.create(100);
      const credit2 = Credit.create(200);

      expect(credit2.isGreaterThan(credit1)).toBe(true);
      expect(credit1.isLessThan(credit2)).toBe(true);
    });
  });
});

