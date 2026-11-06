import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CustomersService } from './customer.service';
import { CustomersController } from './customer.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}