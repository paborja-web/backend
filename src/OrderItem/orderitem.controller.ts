import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { OrderItemService } from './orderitem.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('order-items')
export class OrderItemController {
  constructor(private orderItemsService: OrderItemService) {}

  // Get all order items (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.orderItemsService.getAll();
  }

  // Get single order item by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.orderItemsService.findById(+id);
  }

  // Create order item (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      order_id: number;
      product_id: number;
      quantity?: number;
      unit_price: number;
      subtotal: number;
    },
  ) {
    return this.orderItemsService.createOrderItem(body);
  }

  // Update order item (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.orderItemsService.updateOrderItem(+id, body);
  }

  // Delete order item (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.orderItemsService.deleteOrderItem(+id);
  }
}