import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';
import { IngredientEntity } from './ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IngredientEntity])],
  exports: [TypeOrmModule, IngredientService],
  controllers: [IngredientController],
  providers: [IngredientService],
})
export class IngredientModule {}
