import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface CreateProductDto {
  category_id: number;
  product_name: string;
  description?: string;
  price: number;
  availability?: boolean;
}

export interface UpdateProductDto {
  category_id?: number;
  product_name?: string;
  description?: string;
  price?: number;
  availability?: boolean;
}

@Injectable()
export class ProductsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createProduct(dto: CreateProductDto) {
    const { category_id, product_name, description, price, availability } = dto;
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO product (category_id, product_name, description, price, availability) VALUES (?, ?, ?, ?, ?)',
      [category_id, product_name, description ?? null, price, availability ?? true],
    );
    return { product_id: result.insertId, ...dto };
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT product_id, category_id, product_name, description, price, availability, created_at FROM product WHERE product_id = ?',
      [id],
    );
    return rows[0];
  }

  async findByCategory(categoryId: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT product_id, category_id, product_name, description, price, availability, created_at FROM product WHERE category_id = ?',
      [categoryId],
    );
    return rows;
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT product_id, category_id, product_name, description, price, availability, created_at FROM product',
    );
    return rows;
  }

  async updateProduct(id: number, partial: UpdateProductDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.category_id !== undefined) {
      fields.push('category_id = ?');
      values.push(partial.category_id);
    }
    if (partial.product_name) {
      fields.push('product_name = ?');
      values.push(partial.product_name);
    }
    if (partial.description !== undefined) {
      fields.push('description = ?');
      values.push(partial.description);
    }
    if (partial.price !== undefined) {
      fields.push('price = ?');
      values.push(partial.price);
    }
    if (partial.availability !== undefined) {
      fields.push('availability = ?');
      values.push(partial.availability);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE product SET ${fields.join(', ')} WHERE product_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async deleteProduct(id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM product WHERE product_id = ?', [id]);
    return res.affectedRows > 0;
  }
}