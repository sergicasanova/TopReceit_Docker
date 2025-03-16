import {
  Controller,
  Post,
  Put,
  Get,
  Query,
  Param,
  Body,
  Delete,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto, UpdateRecipeDto } from './recipe.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('recipes')
@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva receta' })
  @ApiResponse({
    status: 201,
    description: 'Receta creada con éxito',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta',
  })
  @ApiBody({ type: CreateRecipeDto })
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    const { title, description, user_id, image } = createRecipeDto;
    return this.recipeService.createRecipe({
      title,
      description,
      user_id,
      image,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una receta' })
  @ApiResponse({
    status: 200,
    description: 'Receta actualizada con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Receta no encontrada',
  })
  @ApiBody({ type: UpdateRecipeDto })
  async update(
    @Param('id') id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipeService.updateRecipe(id, updateRecipeDto);
  }

  @Get('public')
  @ApiOperation({ summary: 'Obtener todas las recetas públicas' })
  @ApiResponse({
    status: 200,
    description: 'Recetas públicas obtenidas con éxito',
  })
  async getPublicRecipes() {
    return this.recipeService.getPublicRecipes();
  }

  @Get('user/:userId/public')
  @ApiOperation({
    summary: 'Obtener las recetas públicas de un usuario específico',
  })
  @ApiResponse({
    status: 200,
    description: 'Recetas públicas del usuario obtenidas con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado o no tiene recetas públicas',
  })
  async getUserPublicRecipes(@Param('userId') userId: string) {
    const recipes = await this.recipeService.getUserPublicRecipes(userId);
    return recipes;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las recetas' })
  @ApiResponse({
    status: 200,
    description: 'Recetas obtenidas con éxito',
  })
  async findAll() {
    return this.recipeService.getAllRecipes();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar recetas por título' })
  @ApiResponse({
    status: 200,
    description: 'Recetas encontradas con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron recetas',
  })
  async search(@Query('title') title: string) {
    return this.recipeService.searchRecipesByTitle(title);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener recetas de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Recetas del usuario obtenidas con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getRecipesByUserId(@Param('userId') userId: string) {
    const recipes = await this.recipeService.getRecipesByUserId(userId);

    return recipes.map((recipe) => ({
      ...recipe,
      user: { id_user: recipe.user.id_user },
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener receta por ID' })
  @ApiResponse({
    status: 200,
    description: 'Receta obtenida con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Receta no encontrada',
  })
  async getRecipe(@Param('id') id: number) {
    return this.recipeService.getRecipeById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar receta por ID' })
  @ApiResponse({
    status: 200,
    description: 'Receta eliminada con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Receta no encontrada',
  })
  async delete(@Param('id') id: number) {
    return this.recipeService.deleteRecipe(id);
  }
}
