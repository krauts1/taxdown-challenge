import { Customer } from '../../domain/entities/customer.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Credit } from '../../domain/value-objects/credit.vo';
import { ICustomerRepository } from '../../domain/repositories/customer.repository';
import prisma from './prisma-client';

export class PrismaCustomerRepository implements ICustomerRepository {
  async save(customer: Customer): Promise<Customer> {
    const customerData = {
      id: customer.getId(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      email: customer.getEmail().getValue(),
      availableCredit: customer.getAvailableCredit().getValue(),
      createdAt: customer.getCreatedAt(),
      updatedAt: customer.getUpdatedAt(),
    };

    const saved = await prisma.customer.upsert({
      where: { id: customer.getId() },
      update: {
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        email: customerData.email,
        availableCredit: customerData.availableCredit,
        updatedAt: customerData.updatedAt,
      },
      create: customerData,
    });

    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return null;
    }

    return this.toDomain(customer);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (!customer) {
      return null;
    }

    return this.toDomain(customer);
  }

  async findAll(): Promise<Customer[]> {
    const customers = await prisma.customer.findMany();

    return customers.map((customer) => this.toDomain(customer));
  }

  async findAllSortedByCredit(order: 'asc' | 'desc'): Promise<Customer[]> {
    const customers = await prisma.customer.findMany({
      orderBy: {
        availableCredit: order,
      },
    });

    return customers.map((customer) => this.toDomain(customer));
  }

  async delete(id: string): Promise<void> {
    await prisma.customer.delete({
      where: { id },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await prisma.customer.count({
      where: { id },
    });

    return count > 0;
  }

  private toDomain(customer: any): Customer {
    return Customer.reconstitute(
      customer.id,
      customer.firstName,
      customer.lastName,
      Email.create(customer.email),
      Credit.create(Number(customer.availableCredit)),
      customer.createdAt,
      customer.updatedAt
    );
  }
}

