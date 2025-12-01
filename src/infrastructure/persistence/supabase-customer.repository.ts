import { Customer } from '../../domain/entities/customer.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { Credit } from '../../domain/value-objects/credit.vo';
import { ICustomerRepository } from '../../domain/repositories/customer.repository';
import { supabase } from './supabase-client';

export class SupabaseCustomerRepository implements ICustomerRepository {
  async save(customer: Customer): Promise<Customer> {
    const customerData = {
      id: customer.getId(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
      email: customer.getEmail().getValue(),
      availableCredit: customer.getAvailableCredit().getValue(),
      createdAt: customer.getCreatedAt().toISOString(),
      updatedAt: customer.getUpdatedAt().toISOString(),
    };

    const { data, error } = await supabase
      .from('customers')
      .upsert(customerData, {
        onConflict: 'id',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save customer: ${error.message}`);
    }

    return this.toDomain(data);
  }

  async findById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to find customer: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.toDomain(data);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to find customer by email: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.toDomain(data);
  }

  async findAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*');

    if (error) {
      throw new Error(`Failed to find all customers: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return data.map((customer) => this.toDomain(customer));
  }

  async findAllSortedByCredit(order: 'asc' | 'desc'): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('availableCredit', { ascending: order === 'asc' });

    if (error) {
      throw new Error(`Failed to find customers sorted by credit: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return data.map((customer) => this.toDomain(customer));
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete customer: ${error.message}`);
    }
  }

  async exists(id: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('customers')
      .select('id')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return false;
      }
      throw new Error(`Failed to check if customer exists: ${error.message}`);
    }

    return !!data;
  }

  private toDomain(customer: any): Customer {
    return Customer.reconstitute(
      customer.id,
      customer.firstName,
      customer.lastName,
      Email.create(customer.email),
      Credit.create(Number(customer.availableCredit)),
      new Date(customer.createdAt),
      new Date(customer.updatedAt)
    );
  }
}

