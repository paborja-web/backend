import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

export interface CreateCategoryDto {
  category_name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  category_name?: string;
  description?: string;
}

@Injectable()
export class CategoriesService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createCategory(dto: CreateCategoryDto) {
    const { category_name, description } = dto;
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO category (category_name, description) VALUES (?, ?)',
      [category_name, description ?? null],
    );
    return { category_id: result.insertId, ...dto };
  }

  async findByName(category_name: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT category_id, category_name, description FROM category WHERE category_name = ?',
      [category_name],
    );
    return rows[0];
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT category_id, category_name, description FROM category WHERE category_id = ?',
      [id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT category_id, category_name, description FROM category',
    );
    return rows;
  }

  async updateCategory(id: number, partial: UpdateCategoryDto) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.category_name) {
      fields.push('category_name = ?');
      values.push(partial.category_name);
    }
    if (partial.description !== undefined) {
      fields.push('description = ?');
      values.push(partial.description);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE category SET ${fields.join(', ')} WHERE category_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async deleteCategory(id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM category WHERE category_id = ?', [id]);
    return res.affectedRows > 0;
  }
}