import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CustomersService } from './customer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  // Get all customers (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.customersService.getAll();
  }

  // Get single customer by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.customersService.findById(+id);
  }

  // Create customer (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      address: string;
    },
  ) {
    return this.customersService.createCustomer(body);
  }

  // Update customer (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.customersService.updateCustomer(+id, body);
  }

  // Delete customer (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.customersService.deleteCustomer(+id);
  }
}