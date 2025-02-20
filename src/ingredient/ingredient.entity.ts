import { RecipeIngredient } from '../recipe_ingredient/recipe_ingredient.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class IngredientEntity {
  @PrimaryGeneratedColumn()
  id_ingredient: number;

  @Column()
  name: string;

  @OneToMany(
    () => RecipeIngredient,
    (recipeIngredient) => recipeIngredient.ingredient,
  )
  recipeIngredients: RecipeIngredient[];
}
