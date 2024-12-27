import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeIngredient } from './recipe_ingredient.entity';
import { Recipe } from '../recipe/recipe.entity';
import { IngredientEntity } from '../ingredient/ingredient.entity';
import {
  CreateRecipeIngredientDto,
  UpdateRecipeIngredientDto,
} from './recipe_ingredient.dto';

@Injectable()
export class RecipeIngredientService {
  constructor(
    @InjectRepository(RecipeIngredient)
    private readonly recipeIngredientRepository: Repository<RecipeIngredient>,

    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,

    @InjectRepository(IngredientEntity)
    private readonly ingredientRepository: Repository<IngredientEntity>,
  ) {}

  async createRecipeIngredient(
    createRecipeIngredientDto: CreateRecipeIngredientDto,
  ): Promise<RecipeIngredient> {
    const { recipeId, ingredientId, quantity, unit } =
      createRecipeIngredientDto;

    const recipe = await this.recipeRepository.findOneBy({ id: recipeId });
    const ingredient = await this.ingredientRepository.findOneBy({
      id_ingredient: ingredientId,
    });

    if (!recipe || !ingredient) {
      throw new NotFoundException('Receta o ingrediente no encontrado');
    }

    const newRecipeIngredient = this.recipeIngredientRepository.create({
      recipe,
      ingredient,
      quantity,
      unit,
    });

    return this.recipeIngredientRepository.save(newRecipeIngredient);
  }

  async getAllIngredientsForRecipe(
    recipeId: number,
  ): Promise<RecipeIngredient[]> {
    return this.recipeIngredientRepository.find({
      where: { recipe: { id: recipeId } },
      relations: ['ingredient'],
    });
  }

  async getIngredientById(id: number): Promise<RecipeIngredient> {
    const ingredient = await this.recipeIngredientRepository.findOne({
      where: { id },
      relations: ['ingredient'],
    });

    if (!ingredient) {
      throw new NotFoundException('Ingrediente no encontrado');
    }

    return ingredient;
  }

  async updateRecipeIngredient(
    id: number,
    updateRecipeIngredientDto: UpdateRecipeIngredientDto,
  ): Promise<RecipeIngredient> {
    const ingredient = await this.recipeIngredientRepository.findOne({
      where: { id },
      relations: ['ingredient'],
    });

    if (!ingredient) {
      throw new NotFoundException('Ingrediente no encontrado');
    }

    Object.assign(ingredient, updateRecipeIngredientDto);
    return this.recipeIngredientRepository.save(ingredient);
  }

  async deleteRecipeIngredient(id: number): Promise<void> {
    const ingredient = await this.recipeIngredientRepository.findOne({
      where: { id },
    });

    if (!ingredient) {
      throw new NotFoundException('Ingrediente no encontrado');
    }

    await this.recipeIngredientRepository.remove(ingredient);
  }
}
