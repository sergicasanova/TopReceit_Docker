import { Controller, Post, Put, Get, Query, Param, Body } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto, UpdateRecipeDto } from './recipe.dto';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}
  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipeService.createRecipe(createRecipeDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipeService.updateRecipe(id, updateRecipeDto);
  }

  @Get()
  async findAll() {
    return this.recipeService.getAllRecipes();
  }

  @Get('search')
  async search(@Query('title') title: string) {
    return this.recipeService.searchRecipesByTitle(title);
  }

  @Get(':id')
  async getRecipe(@Param('id') id: number) {
    return this.recipeService.getRecipeById(id);
  }
}
