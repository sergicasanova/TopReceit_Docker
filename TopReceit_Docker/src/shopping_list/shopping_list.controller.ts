import {
  Controller,
  Post,
  Param,
  NotFoundException,
  Delete,
  Get,
  Patch,
} from '@nestjs/common';
import { ShoppingListService } from './shopping_list.service';

@Controller('shopping-lists')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Get('get-shopping-list/:userId')
  async getShoppingList(@Param('userId') userId: string) {
    try {
      return await this.shoppingListService.getShoppingList(userId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('add-recipe-ingredients/:userId/:recipeId')
  async addRecipeIngredients(
    @Param('userId') userId: string,
    @Param('recipeId') recipeId: number,
  ) {
    try {
      return await this.shoppingListService.addRecipeIngredientsToShoppingList(
        userId,
        recipeId,
      );
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete('clear-shopping-list/:userId')
  async clearShoppingList(@Param('userId') userId: string) {
    try {
      await this.shoppingListService.clearShoppingList(userId);
      return { message: 'Lista de la compra vaciada correctamente' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete('remove-item/:userId/:itemId')
  async removeItem(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    try {
      await this.shoppingListService.removeShoppingListItem(userId, itemId);
      return { message: 'Ítem eliminado correctamente' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Patch('toggle-item-purchased/:userId/:itemId')
  async toggleItemPurchased(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
  ) {
    try {
      return await this.shoppingListService.toggleItemPurchased(userId, itemId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
