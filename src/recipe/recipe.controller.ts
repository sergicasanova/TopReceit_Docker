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

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
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

  @Get('user/:userId')
  async getRecipesByUserId(@Param('userId') userId: string) {
    const recipes = await this.recipeService.getRecipesByUserId(userId);

    return recipes.map((recipe) => ({
      ...recipe,
      user: { id_user: recipe.user.id_user },
    }));
  }

  @Get(':id')
  async getRecipe(@Param('id') id: number) {
    return this.recipeService.getRecipeById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.recipeService.deleteRecipe(id);
  }
}
