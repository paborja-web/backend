import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface CreateDeliveryDto {
  order_id: number;
  delivery_address: string;
  delivery_status?: string;
  delivery_date?: Date | string;
}

export interface UpdateDeliveryDto {
  order_id?: number;
  delivery_address?: string;
  delivery_status?: string;
  delivery_date?: Date | string;
}

@Injectable()
export class DeliveriesService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createDelivery(dto: CreateDeliveryDto) {
    const { order_id, delivery_address, delivery_status, delivery_date } = dto;
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO delivery (order_id, delivery_address, delivery_status, delivery_date) VALUES (?, ?, ?, ?)',
      [order_id, delivery_address, delivery_status ?? 'Preparing', delivery_date ?? null],
    );
    return { delivery_id: result.insertId, ...dto };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT delivery_id, order_id, delivery_address, delivery_status, delivery_date FROM delivery WHERE delivery_id = ?',
      [id],
    );
    return rows[0];
  }

  async findByOrder(orderId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT delivery_id, order_id, delivery_address, delivery_status, delivery_date FROM delivery WHERE order_id = ?',
      [orderId],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT delivery_id, order_id, delivery_address, delivery_status, delivery_date FROM delivery',
    );
    return rows;
  }

  async updateDelivery(id: number, partial: UpdateDeliveryDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.order_id !== undefined) {
      fields.push('order_id = ?');
      values.push(partial.order_id);
    }
    if (partial.delivery_address) {
      fields.push('delivery_address = ?');
      values.push(partial.delivery_address);
    }
    if (partial.delivery_status) {
      fields.push('delivery_status = ?');
      values.push(partial.delivery_status);
    }
    if (partial.delivery_date !== undefined) {
      fields.push('delivery_date = ?');
      values.push(partial.delivery_date);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE delivery SET ${fields.join(', ')} WHERE delivery_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async deleteDelivery(id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM delivery WHERE delivery_id = ?', [id]);
    return res.affectedRows > 0;
  }
}