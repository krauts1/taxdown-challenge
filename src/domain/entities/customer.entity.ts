import { Email } from '../value-objects/email.vo';
import { Credit } from '../value-objects/credit.vo';

export class Customer {
  private id: string;
  private firstName: string;
  private lastName: string;
  private email: Email;
  private availableCredit: Credit;
  private createdAt: Date;
  private updatedAt: Date;

  private constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: Email,
    availableCredit: Credit,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.availableCredit = availableCredit;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    id: string,
    firstName: string,
    lastName: string,
    email: Email
  ): Customer {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name cannot be empty');
    }

    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name cannot be empty');
    }

    const now = new Date();

    return new Customer(
      id,
      firstName.trim(),
      lastName.trim(),
      email,
      Credit.zero(),
      now,
      now
    );
  }

  static reconstitute(
    id: string,
    firstName: string,
    lastName: string,
    email: Email,
    availableCredit: Credit,
    createdAt: Date,
    updatedAt: Date
  ): Customer {
    return new Customer(
      id,
      firstName,
      lastName,
      email,
      availableCredit,
      createdAt,
      updatedAt
    );
  }

  getId(): string {
    return this.id;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  getEmail(): Email {
    return this.email;
  }

  getAvailableCredit(): Credit {
    return this.availableCredit;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateFirstName(firstName: string): void {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name cannot be empty');
    }
    this.firstName = firstName.trim();
    this.updatedAt = new Date();
  }

  updateLastName(lastName: string): void {
    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name cannot be empty');
    }
    this.lastName = lastName.trim();
    this.updatedAt = new Date();
  }

  updateEmail(email: Email): void {
    this.email = email;
    this.updatedAt = new Date();
  }

  addCredit(amount: number): void {
    this.availableCredit = this.availableCredit.add(amount);
    this.updatedAt = new Date();
  }

  subtractCredit(amount: number): void {
    this.availableCredit = this.availableCredit.subtract(amount);
    this.updatedAt = new Date();
  }
}

