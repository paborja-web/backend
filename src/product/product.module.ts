import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}