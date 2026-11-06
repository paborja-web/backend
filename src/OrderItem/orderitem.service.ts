import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface CreateOrderItemDto {
  order_id: number;
  product_id: number;
  quantity?: number;
  unit_price: number;
  subtotal: number;
}

export interface UpdateOrderItemDto {
  order_id?: number;
  product_id?: number;
  quantity?: number;
  unit_price?: number;
  subtotal?: number;
}

@Injectable()
export class OrderItemService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createOrderItem(dto: CreateOrderItemDto) {
    const { order_id, product_id, quantity, unit_price, subtotal } = dto;
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO order_item (order_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)',
      [order_id, product_id, quantity ?? 1, unit_price, subtotal],
    );
    return { order_item_id: result.insertId, ...dto };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_item_id, order_id, product_id, quantity, unit_price, subtotal FROM order_item WHERE order_item_id = ?',
      [id],
    );
    return rows[0];
  }

  async findByOrder(orderId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_item_id, order_id, product_id, quantity, unit_price, subtotal FROM order_item WHERE order_id = ?',
      [orderId],
    );
    return rows;
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_item_id, order_id, product_id, quantity, unit_price, subtotal FROM order_item',
    );
    return rows;
  }

  async updateOrderItem(id: number, partial: UpdateOrderItemDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.order_id !== undefined) {
      fields.push('order_id = ?');
      values.push(partial.order_id);
    }
    if (partial.product_id !== undefined) {
      fields.push('product_id = ?');
      values.push(partial.product_id);
    }
    if (partial.quantity !== undefined) {
      fields.push('quantity = ?');
      values.push(partial.quantity);
    }
    if (partial.unit_price !== undefined) {
      fields.push('unit_price = ?');
      values.push(partial.unit_price);
    }
    if (partial.subtotal !== undefined) {
      fields.push('subtotal = ?');
      values.push(partial.subtotal);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE order_item SET ${fields.join(', ')} WHERE order_item_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async deleteOrderItem(id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM order_item WHERE order_item_id = ?', [id]);
    return res.affectedRows > 0;
  }
}