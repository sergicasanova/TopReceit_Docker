import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeIngredient } from './recipe_ingredient.entity';
import {
  CreateRecipeIngredientDto,
  UpdateRecipeIngredientDto,
} from './recipe_ingredient.dto';

@Injectable()
export class RecipeIngredientService {
  constructor(
    @InjectRepository(RecipeIngredient)
    private readonly recipeIngredientRepository: Repository<RecipeIngredient>,
  ) {}

  async createRecipeIngredient(
    createRecipeIngredientDto: CreateRecipeIngredientDto,
  ): Promise<RecipeIngredient> {
    const { recipe_id, ingredient_id, quantity, unit } =
      createRecipeIngredientDto;

    const newRecipeIngredient = this.recipeIngredientRepository.create({
      recipe: { id_recipe: recipe_id },
      ingredient: { id_ingredient: ingredient_id },
      quantity,
      unit,
    });

    return this.recipeIngredientRepository.save(newRecipeIngredient);
  }

  async getAllIngredientsForRecipe(
    recipeId: number,
  ): Promise<RecipeIngredient[]> {
    return this.recipeIngredientRepository.find({
      where: { recipe: { id_recipe: recipeId } },
      relations: ['ingredient'],
    });
  }

  async getIngredientById(
    id_recipe_ingredient: number,
  ): Promise<RecipeIngredient> {
    const ingredient = await this.recipeIngredientRepository.findOne({
      where: { id_recipe_ingredient },
      relations: ['ingredient'],
    });

    if (!ingredient) {
      throw new NotFoundException('Ingrediente no encontrado');
    }

    return ingredient;
  }

  async updateRecipeIngredient(
    recipe_id: number,
    id: number,
    updateRecipeIngredientDto: UpdateRecipeIngredientDto,
  ): Promise<RecipeIngredient> {
    const ingredient = await this.recipeIngredientRepository.findOne({
      where: { id_recipe_ingredient: id, recipe: { id_recipe: recipe_id } },
      relations: ['recipe', 'ingredient'],
    });

    if (!ingredient) {
      throw new NotFoundException('Ingrediente no encontrado en esta receta');
    }

    if (updateRecipeIngredientDto.ingredient_id) {
      ingredient.ingredient.id_ingredient =
        updateRecipeIngredientDto.ingredient_id;
    }

    Object.assign(ingredient, updateRecipeIngredientDto);

    return this.recipeIngredientRepository.save(ingredient);
  }

  async deleteRecipeIngredient(
    recipeId: number,
    ingredientId: number,
  ): Promise<void> {
    const ingredient = await this.recipeIngredientRepository.findOne({
      where: {
        ingredient: { id_ingredient: ingredientId },
        recipe: { id_recipe: recipeId },
      },
    });

    if (!ingredient) {
      throw new NotFoundException('Ingrediente no encontrado en esta receta');
    }

    await this.recipeIngredientRepository.remove(ingredient);
  }
}
