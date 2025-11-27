export class Credit {
  private readonly value: number;

  private constructor(amount: number) {
    this.value = amount;
  }

  static create(amount: number): Credit {
    if (amount < 0) {
      throw new Error('Credit cannot be negative');
    }

    const roundedAmount = Math.round(amount * 100) / 100;

    return new Credit(roundedAmount);
  }

  static zero(): Credit {
    return new Credit(0);
  }

  getValue(): number {
    return this.value;
  }

  add(amount: number): Credit {
    return Credit.create(this.value + amount);
  }

  subtract(amount: number): Credit {
    return Credit.create(this.value - amount);
  }

  equals(other: Credit): boolean {
    return this.value === other.value;
  }

  isGreaterThan(other: Credit): boolean {
    return this.value > other.value;
  }

  isLessThan(other: Credit): boolean {
    return this.value < other.value;
  }
}

