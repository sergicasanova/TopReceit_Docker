import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { RecipeIngredientService } from './recipe_ingredient.service';
import {
  CreateRecipeIngredientDto,
  UpdateRecipeIngredientDto,
} from './recipe_ingredient.dto';

@Controller('recipe-ingredients')
export class RecipeIngredientController {
  constructor(
    private readonly recipeIngredientService: RecipeIngredientService,
  ) {}

  @Post()
  async create(@Body() createRecipeIngredientDto: CreateRecipeIngredientDto) {
    return this.recipeIngredientService.createRecipeIngredient(
      createRecipeIngredientDto,
    );
  }

  @Get('recipe/:recipeId')
  async getAll(@Param('recipeId') recipeId: number) {
    return this.recipeIngredientService.getAllIngredientsForRecipe(recipeId);
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    return this.recipeIngredientService.getIngredientById(id);
  }

  @Put(':recipeId/:id')
  async update(
    @Param('recipeId') recipeId: number,
    @Param('id') id: number,
    @Body() updateRecipeIngredientDto: UpdateRecipeIngredientDto,
  ) {
    return this.recipeIngredientService.updateRecipeIngredient(
      recipeId,
      id,
      updateRecipeIngredientDto,
    );
  }

  // Eliminar una relación entre receta e ingrediente
  @Delete(':recipeId/:id')
  async remove(@Param('recipeId') recipeId: number, @Param('id') id: number) {
    return this.recipeIngredientService.deleteRecipeIngredient(recipeId, id);
  }
}
