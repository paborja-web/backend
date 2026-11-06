import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // Get all payments (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.paymentsService.getAll();
  }

  // Get single payment by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.paymentsService.findById(+id);
  }

  // Create payment (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      order_id: number;
      payment_method: string;
      payment_status?: string;
      payment_date?: Date | string;
      amount: number;
    },
  ) {
    return this.paymentsService.createPayment(body);
  }

  // Update payment (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.paymentsService.updatePayment(+id, body);
  }

  // Delete payment (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.paymentsService.deletePayment(+id);
  }
}