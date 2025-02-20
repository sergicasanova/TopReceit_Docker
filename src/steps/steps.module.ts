import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Steps } from './steps.entity';
import { StepsController } from './steps.controller';
import { StepsService } from './steps.service';
import { Recipe } from '../recipe/recipe.entity';
import { RecipeIngredientModule } from '../recipe_ingredient/recipe_ingredient.module';

@Module({
  imports: [TypeOrmModule.forFeature([Steps, Recipe]), RecipeIngredientModule],
  controllers: [StepsController],
  providers: [StepsService],
  exports: [StepsService],
})
export class StepsModule {}
