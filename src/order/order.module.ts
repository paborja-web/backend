import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OrdersService } from './order.service';
import { OrdersController } from './order.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}