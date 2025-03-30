import {
  Controller,
  Post,
  Param,
  NotFoundException,
  Delete,
  Get,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ShoppingListService } from './shopping_list.service';

@ApiTags('shopping-lists')
@ApiBearerAuth()
@Controller('shopping-lists')
export class ShoppingListController {
  constructor(private readonly shoppingListService: ShoppingListService) {}

  @Get('get-shopping-list/:userId')
  @ApiOperation({ summary: 'Get shopping list by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Shopping list retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Shopping list not found.' })
  async getShoppingList(@Param('userId') userId: string) {
    try {
      return await this.shoppingListService.getShoppingList(userId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('add-recipe-ingredients/:userId/:recipeId')
  @ApiOperation({ summary: 'Add recipe ingredients to shopping list' })
  @ApiResponse({ status: 201, description: 'Ingredients added successfully.' })
  @ApiResponse({ status: 404, description: 'User or recipe not found.' })
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
  @ApiOperation({ summary: 'Clear shopping list by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Shopping list cleared successfully.',
  })
  @ApiResponse({ status: 404, description: 'Shopping list not found.' })
  async clearShoppingList(@Param('userId') userId: string) {
    try {
      await this.shoppingListService.clearShoppingList(userId);
      return { message: 'Lista de la compra vaciada correctamente' };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete('remove-item/:userId/:itemId')
  @ApiOperation({ summary: 'Remove item from shopping list' })
  @ApiResponse({ status: 200, description: 'Item removed successfully.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
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
  @ApiOperation({ summary: 'Toggle item purchased status' })
  @ApiResponse({
    status: 200,
    description: 'Item status toggled successfully.',
  })
  @ApiResponse({ status: 404, description: 'Item not found.' })
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
