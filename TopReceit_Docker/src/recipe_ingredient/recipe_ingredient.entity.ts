import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Recipe } from '../recipe/recipe.entity';
import { IngredientEntity } from '../ingredient/ingredient.entity';

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryGeneratedColumn()
  id_recipe_ingredient: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients, {
    onDelete: 'CASCADE', // Borra ingredientes si la receta se elimina
  })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @ManyToOne(
    () => IngredientEntity,
    (ingredient) => ingredient.recipeIngredients,
    {
      eager: true, // Carga automaticamente los datos del ingrediente
    },
  )
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: IngredientEntity;

  @Column()
  quantity: number;

  @Column()
  unit: string;
}
