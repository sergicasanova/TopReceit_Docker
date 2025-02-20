import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeIngredient } from './recipe_ingredient.entity';
import {
  CreateRecipeIngredientDto,
  UpdateRecipeIngredientDto,
} from './recipe_ingredient.dto';
import { Recipe } from '../recipe/recipe.entity';
import { IngredientEntity } from '../ingredient/ingredient.entity';

@Injectable()
export class RecipeIngredientService {
  constructor(
    @InjectRepository(RecipeIngredient)
    private readonly recipeIngredientRepository: Repository<RecipeIngredient>,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @InjectRepository(IngredientEntity)
    private ingredientRepository: Repository<IngredientEntity>,
  ) {}

  async createRecipeIngredient(
    createRecipeIngredientDto: CreateRecipeIngredientDto,
  ): Promise<RecipeIngredient> {
    const { recipe_id, ingredient_id, quantity, unit } =
      createRecipeIngredientDto;

    if (!recipe_id || !ingredient_id) {
      throw new BadRequestException(
        'El ID de receta y el ID de ingrediente son obligatorios',
      );
    }

    const recipeExists = await this.recipeRepository.findOne({
      where: { id_recipe: recipe_id },
    });
    if (!recipeExists) {
      throw new NotFoundException('La receta no existe');
    }

    const ingredientExists = await this.ingredientRepository.findOne({
      where: { id_ingredient: ingredient_id },
    });
    if (!ingredientExists) {
      throw new NotFoundException('El ingrediente no existe');
    }

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
    const recipeExists = await this.recipeRepository.findOne({
      where: { id_recipe: recipe_id },
    });
    if (!recipeExists) {
      throw new NotFoundException('Receta no encontrada');
    }

    const existingRecipeIngredient =
      await this.recipeIngredientRepository.findOne({
        where: {
          id_recipe_ingredient: id,
          recipe: { id_recipe: recipe_id },
        },
        relations: ['recipe', 'ingredient'],
      });

    if (!existingRecipeIngredient) {
      throw new NotFoundException(
        'La combinación de receta e ingrediente no existe',
      );
    }

    if (updateRecipeIngredientDto.ingredient_id) {
      existingRecipeIngredient.ingredient.id_ingredient =
        updateRecipeIngredientDto.ingredient_id;
    }

    Object.assign(existingRecipeIngredient, updateRecipeIngredientDto);
    return this.recipeIngredientRepository.save(existingRecipeIngredient);
  }

  async deleteRecipeIngredient(idRecipeIngredient: number): Promise<void> {
    const ingredient = await this.recipeIngredientRepository.findOne({
      where: {
        id_recipe_ingredient: idRecipeIngredient,
      },
      relations: ['recipe', 'ingredient'],
    });

    if (!ingredient) {
      throw new NotFoundException('Recipe_Ingrediente no encontrado');
    }

    console.log('Ingredient found:', ingredient);

    await this.recipeIngredientRepository.remove(ingredient);
  }
}
