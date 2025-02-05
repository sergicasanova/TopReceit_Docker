import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Recipe } from './recipe.entity';
import { CreateRecipeDto, UpdateRecipeDto } from './recipe.dto';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  async createRecipe(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const { title, description, user_id, image } = createRecipeDto;

    const user = { id_user: user_id };

    const newRecipe = this.recipeRepository.create({
      title,
      description,
      image,
      user,
    });

    return this.recipeRepository.save(newRecipe);
  }

  async updateRecipe(
    id_recipe: number,
    updateRecipeDto: UpdateRecipeDto,
  ): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id_recipe },
    });
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }

    Object.assign(recipe, updateRecipeDto);
    return this.recipeRepository.save(recipe);
  }

  async getAllRecipes(): Promise<Recipe[]> {
    const recipes = await this.recipeRepository.find({
      relations: ['recipeIngredients', 'steps', 'user', 'likes.user'],
    });

    return recipes;
  }

  async searchRecipesByTitle(title: string): Promise<Recipe[]> {
    return this.recipeRepository.find({
      where: {
        title: Like(`%${title}%`),
      },
    });
  }

  async getRecipesByUserId(userId: string): Promise<Recipe[]> {
    const recipes = await this.recipeRepository.find({
      where: { user: { id_user: userId } },
      relations: ['recipeIngredients', 'steps', 'user'],
    });

    return recipes;
  }

  async getRecipeById(id_recipe: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id_recipe },
      relations: ['steps', 'recipeIngredients'],
    });
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }
    return recipe;
  }

  async deleteRecipe(id_recipe: number): Promise<void> {
    const recipe = await this.recipeRepository.findOne({
      where: { id_recipe },
    });

    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }

    await this.recipeRepository.remove(recipe);
  }
}
