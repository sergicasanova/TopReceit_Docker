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
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('recipe-ingredients')
@Controller('recipe-ingredients')
export class RecipeIngredientController {
  constructor(
    private readonly recipeIngredientService: RecipeIngredientService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un ingrediente para una receta' })
  @ApiResponse({
    status: 201,
    description: 'Ingrediente de receta creado con éxito',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta',
  })
  @ApiBody({ type: CreateRecipeIngredientDto })
  async create(@Body() createRecipeIngredientDto: CreateRecipeIngredientDto) {
    return this.recipeIngredientService.createRecipeIngredient(
      createRecipeIngredientDto,
    );
  }

  @Get('recipe/:recipeId')
  @ApiOperation({ summary: 'Obtener todos los ingredientes de una receta' })
  @ApiResponse({
    status: 200,
    description: 'Ingredientes de la receta obtenidos con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Receta no encontrada',
  })
  @ApiParam({ name: 'recipeId', description: 'ID de la receta' })
  async getAll(@Param('recipeId') recipeId: number) {
    return this.recipeIngredientService.getAllIngredientsForRecipe(recipeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un ingrediente de receta por ID' })
  @ApiResponse({
    status: 200,
    description: 'Ingrediente de receta obtenido con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Ingrediente no encontrado',
  })
  @ApiParam({ name: 'id', description: 'ID del ingrediente' })
  async getOne(@Param('id') id: number) {
    return this.recipeIngredientService.getIngredientById(id);
  }

  @Put(':recipeId/:id')
  @ApiOperation({ summary: 'Actualizar un ingrediente de receta' })
  @ApiResponse({
    status: 200,
    description: 'Ingrediente de receta actualizado con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Ingrediente o receta no encontrados',
  })
  @ApiParam({ name: 'recipeId', description: 'ID de la receta' })
  @ApiParam({ name: 'id', description: 'ID del ingrediente' })
  @ApiBody({ type: UpdateRecipeIngredientDto })
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

  @ApiOperation({ summary: 'Eliminar un ingrediente de receta' })
  @ApiResponse({
    status: 200,
    description: 'Ingrediente de receta eliminado con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Ingrediente o receta no encontrados',
  })
  @ApiParam({ name: 'recipeId', description: 'ID de la receta' })
  @ApiParam({ name: 'id', description: 'ID del ingrediente' })
  @Delete(':recipeId/:id')
  async remove(@Param('recipeId') recipeId: number, @Param('id') id: number) {
    return this.recipeIngredientService.deleteRecipeIngredient(recipeId, id);
  }
}
