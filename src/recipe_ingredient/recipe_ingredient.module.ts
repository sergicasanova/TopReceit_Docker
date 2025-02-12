import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeIngredient } from './recipe_ingredient.entity';
import { RecipeIngredientController } from './recipe_ingredient.controller';
import { RecipeIngredientService } from './recipe_ingredient.service';
import { Recipe } from '../recipe/recipe.entity';
import { IngredientEntity } from '../ingredient/ingredient.entity';
import { RecipeModule } from '../recipe/recipe.module';
import { IngredientModule } from '../ingredient/ingredient.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeIngredient, Recipe, IngredientEntity]),
    RecipeModule,
    IngredientModule,
  ],
  controllers: [RecipeIngredientController],
  providers: [RecipeIngredientService],
  exports: [RecipeIngredientService],
})
export class RecipeIngredientModule {}
