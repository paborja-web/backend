import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CustomersModule } from './customer/customer.module';
import { CategoriesModule } from './category/category.module';
import { ProductsModule } from './product/product.module';
import { OrdersModule } from './order/order.module';
import { OrderItemModule } from './OrderItem/orderitem.module';
import { PaymentsModule } from './payment/payment.module';
import { DeliveriesModule } from './delivery/delivery.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, CustomersModule, CategoriesModule, ProductsModule, OrdersModule, OrderItemModule, PaymentsModule, DeliveriesModule],
})

export class AppModule {}