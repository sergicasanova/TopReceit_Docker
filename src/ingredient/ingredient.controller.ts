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

@Controller('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Get()
  async getAllIngredients(@Query('name') name?: string) {
    if (name) {
      return await this.ingredientService.getIngredientsByName(name);
    }
    return await this.ingredientService.getAllIngredients();
  }

  @Post()
  async createIngredient(@Body() ingredientDto: IngredientDto) {
    return await this.ingredientService.createIngredient(ingredientDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.ingredientService.deleteIngredient(id);
  }
}
