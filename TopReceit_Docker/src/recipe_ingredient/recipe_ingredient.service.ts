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

  /**
   * Crea una nueva relación entre una receta y un ingrediente.
   * Verifica que la receta y el ingrediente existan antes de crear la relación.
   */
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

  /**
   * Obtiene todos los ingredientes asociados a una receta específica.
   */
  async getAllIngredientsForRecipe(
    recipeId: number,
  ): Promise<RecipeIngredient[]> {
    return this.recipeIngredientRepository.find({
      where: { recipe: { id_recipe: recipeId } },
      relations: ['ingredient'],
    });
  }

  /**
   * Obtiene un ingrediente de receta por su ID.
   */
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

  /**
   * Actualiza la información de un ingrediente en una receta.
   * Verifica que el ingrediente de la receta exista antes de actualizar.
   */
  async updateRecipeIngredient(
    id: number,
    updateRecipeIngredientDto: UpdateRecipeIngredientDto,
  ): Promise<RecipeIngredient> {
    const existingRecipeIngredient =
      await this.recipeIngredientRepository.findOne({
        where: { id_recipe_ingredient: id },
        relations: ['ingredient'],
      });

    if (!existingRecipeIngredient) {
      throw new NotFoundException('Ingrediente de receta no encontrado');
    }

    if (updateRecipeIngredientDto.ingredient_id) {
      existingRecipeIngredient.ingredient.id_ingredient =
        updateRecipeIngredientDto.ingredient_id;
    }

    Object.assign(existingRecipeIngredient, updateRecipeIngredientDto);

    return this.recipeIngredientRepository.save(existingRecipeIngredient);
  }

  /**
   * Elimina un ingrediente de una receta.
   * Verifica que la relación entre la receta y el ingrediente exista antes de eliminarla.
   */
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
