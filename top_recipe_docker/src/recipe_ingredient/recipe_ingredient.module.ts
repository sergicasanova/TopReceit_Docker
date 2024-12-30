import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeIngredient } from './recipe_ingredient.entity';
import { RecipeIngredientController } from './recipe_ingredient.controller';
import { RecipeIngredientService } from './recipe_ingredient.service';
import { RecipeModule } from 'src/recipe/recipe.module';
import { IngredientModule } from 'src/ingredient/ingredient.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecipeIngredient]),
    RecipeModule,
    IngredientModule,
  ],
  controllers: [RecipeIngredientController],
  providers: [RecipeIngredientService],
  exports: [RecipeIngredientService],
})
export class RecipeIngredientModule {}
