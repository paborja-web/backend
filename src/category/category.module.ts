import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CategoriesService } from './category.service';
import { CategoriesController } from './category.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}