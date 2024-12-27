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
    const newRecipe = this.recipeRepository.create(createRecipeDto);
    return this.recipeRepository.save(newRecipe);
  }

  async updateRecipe(
    id: number,
    updateRecipeDto: UpdateRecipeDto,
  ): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({ where: { id } });
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }

    Object.assign(recipe, updateRecipeDto);
    return this.recipeRepository.save(recipe);
  }

  async getAllRecipes(): Promise<Recipe[]> {
    return this.recipeRepository.find({
      relations: ['recipeIngredients', 'steps'],
    });
  }

  async searchRecipesByTitle(title: string): Promise<Recipe[]> {
    return this.recipeRepository.find({
      where: { title: Like(`%${title}%`) },
    });
  }

  async getRecipeById(id: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['steps', 'recipeIngredients'],
    });
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }
    return recipe;
  }
}
