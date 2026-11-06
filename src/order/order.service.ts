import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface CreateOrderDto {
  customer_id: number;
  total_amount?: number;
  order_status?: string;
}

export interface UpdateOrderDto {
  customer_id?: number;
  total_amount?: number;
  order_status?: string;
}

@Injectable()
export class OrdersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createOrder(dto: CreateOrderDto) {
    const { customer_id, total_amount, order_status } = dto;
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO orders (customer_id, total_amount, order_status) VALUES (?, ?, ?)',
      [customer_id, total_amount ?? 0.00, order_status ?? 'Pending'],
    );
    return { order_id: result.insertId, ...dto };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_id, customer_id, order_date, total_amount, order_status FROM orders WHERE order_id = ?',
      [id],
    );
    return rows[0];
  }

  async findByCustomer(customerId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_id, customer_id, order_date, total_amount, order_status FROM orders WHERE customer_id = ?',
      [customerId],
    );
    return rows;
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_id, customer_id, order_date, total_amount, order_status FROM orders',
    );
    return rows;
  }

  async updateOrder(id: number, partial: UpdateOrderDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.customer_id !== undefined) {
      fields.push('customer_id = ?');
      values.push(partial.customer_id);
    }
    if (partial.total_amount !== undefined) {
      fields.push('total_amount = ?');
      values.push(partial.total_amount);
    }
    if (partial.order_status) {
      fields.push('order_status = ?');
      values.push(partial.order_status);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);

    const [result] = await this.pool().execute<OkPacket>(
      `UPDATE orders SET ${fields.join(', ')} WHERE order_id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return this.findById(id);
  }

  async deleteOrder(id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM orders WHERE order_id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return { message: `Order with ID ${id} deleted successfully` };
  }
}