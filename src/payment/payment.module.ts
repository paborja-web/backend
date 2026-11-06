import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PaymentsService } from './payment.service';
import { PaymentsController } from './payment.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}