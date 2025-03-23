import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Recipe } from '../recipe/recipe.entity';
import { RecipeIngredient } from '../recipe_ingredient/recipe_ingredient.entity';
import { ShoppingListItem } from './shopping_list_item.entity';
import { ShoppingList } from './shopping_list.entity';
import { ShoppingListService } from './shopping_list.service';
import { ShoppingListController } from './shopping_list.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShoppingList,
      ShoppingListItem,
      User,
      Recipe,
      RecipeIngredient,
    ]),
  ],
  providers: [ShoppingListService],
  controllers: [ShoppingListController],
})
export class ShoppingListModule {}
