import {
  Controller,
  Get,
  Body,
  Post,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientDto } from './ingredient.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('ingredients')
@Controller('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los ingredientes o filtrar por nombre',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ingredientes',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta',
  })
  async getAllIngredients(@Query('name') name?: string) {
    if (name) {
      return await this.ingredientService.getIngredientsByName(name);
    }
    return await this.ingredientService.getAllIngredients();
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo ingrediente' })
  @ApiResponse({
    status: 201,
    description: 'Ingrediente creado con éxito',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta',
  })
  async createIngredient(@Body() ingredientDto: IngredientDto) {
    return await this.ingredientService.createIngredient(ingredientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un ingrediente por ID' })
  @ApiResponse({
    status: 200,
    description: 'Ingrediente eliminado con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Ingrediente no encontrado',
  })
  async delete(@Param('id') id: number) {
    return this.ingredientService.deleteIngredient(id);
  }
}
