import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CategoriesService } from './category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  // Get all categories (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.categoriesService.getAll();
  }

  // Get single category by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.categoriesService.findById(+id);
  }

  // Create category (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      category_name: string;
      description?: string;
    },
  ) {
    return this.categoriesService.createCategory(body);
  }

  // Update category (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.categoriesService.updateCategory(+id, body);
  }

  // Delete category (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(+id);
  }
}