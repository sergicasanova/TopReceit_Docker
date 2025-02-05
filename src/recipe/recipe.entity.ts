import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../users/users.entity';
import { RecipeIngredient } from '../recipe_ingredient/recipe_ingredient.entity';
import { Steps } from '../steps/steps.entity';
import { Favorite } from 'src/favorites/favorites.entity';
import { Like } from 'src/likes/likes.entity';

@Entity('recipe')
export class Recipe {
  @PrimaryGeneratedColumn()
  id_recipe: number;

  @ManyToOne(() => User, (user) => user.recipes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(
    () => RecipeIngredient,
    (recipeIngredient) => recipeIngredient.recipe,
    {
      cascade: true,
    },
  )
  recipeIngredients: RecipeIngredient[];

  @OneToMany(() => Steps, (steps) => steps.recipe, { cascade: true })
  steps: Steps[];

  @OneToMany(() => Favorite, (favorite) => favorite.recipe)
  favorites: Favorite[];

  @OneToMany(() => Like, (like) => like.recipe)
  likes: Like[];
}
