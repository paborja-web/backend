import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DeliveriesService } from './delivery.service';
import { DeliveriesController } from './delivery.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [DeliveriesController],
  providers: [DeliveriesService],
  exports: [DeliveriesService],
})
export class DeliveriesModule {}