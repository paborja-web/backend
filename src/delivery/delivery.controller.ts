import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { DeliveriesService } from './delivery.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private deliveriesService: DeliveriesService) {}

  // Get all deliveries (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.deliveriesService.getAll();
  }

  // Get single delivery by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.deliveriesService.findById(+id);
  }

  // Create delivery (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      order_id: number;
      delivery_address: string;
      delivery_status?: string;
      delivery_date?: Date | string;
    },
  ) {
    return this.deliveriesService.createDelivery(body);
  }

  // Update delivery (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.deliveriesService.updateDelivery(+id, body);
  }

  // Delete delivery (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.deliveriesService.deleteDelivery(+id);
  }
}