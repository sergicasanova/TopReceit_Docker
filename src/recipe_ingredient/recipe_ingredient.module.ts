import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeIngredient } from './recipe_ingredient.entity';
import { RecipeIngredientController } from './recipe_ingredient.controller';
import { RecipeIngredientService } from './recipe_ingredient.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeIngredient])],
  controllers: [RecipeIngredientController],
  providers: [RecipeIngredientService],
  exports: [RecipeIngredientService],
})
export class RecipeIngredientModule {}
