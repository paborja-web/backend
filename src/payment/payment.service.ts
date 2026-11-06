import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface CreatePaymentDto {
  order_id: number;
  payment_method: string;
  payment_status?: string;
  payment_date?: Date | string;
  amount: number;
}

export interface UpdatePaymentDto {
  order_id?: number;
  payment_method?: string;
  payment_status?: string;
  payment_date?: Date | string;
  amount?: number;
}

@Injectable()
export class PaymentsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createPayment(dto: CreatePaymentDto) {
    const { order_id, payment_method, payment_status, payment_date, amount } = dto;
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO payment (order_id, payment_method, payment_status, payment_date, amount) VALUES (?, ?, ?, ?, ?)',
      [order_id, payment_method, payment_status ?? 'Pending', payment_date ?? null, amount],
    );
    return { payment_id: result.insertId, ...dto };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT payment_id, order_id, payment_method, payment_status, payment_date, amount FROM payment WHERE payment_id = ?',
      [id],
    );
    return rows[0];
  }

  async findByOrder(orderId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT payment_id, order_id, payment_method, payment_status, payment_date, amount FROM payment WHERE order_id = ?',
      [orderId],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT payment_id, order_id, payment_method, payment_status, payment_date, amount FROM payment',
    );
    return rows;
  }

  async updatePayment(id: number, partial: UpdatePaymentDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.order_id !== undefined) {
      fields.push('order_id = ?');
      values.push(partial.order_id);
    }
    if (partial.payment_method) {
      fields.push('payment_method = ?');
      values.push(partial.payment_method);
    }
    if (partial.payment_status) {
      fields.push('payment_status = ?');
      values.push(partial.payment_status);
    }
    if (partial.payment_date !== undefined) {
      fields.push('payment_date = ?');
      values.push(partial.payment_date);
    }
    if (partial.amount !== undefined) {
      fields.push('amount = ?');
      values.push(partial.amount);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE payment SET ${fields.join(', ')} WHERE payment_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async deletePayment(id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM payment WHERE payment_id = ?', [id]);
    return res.affectedRows > 0;
  }
}