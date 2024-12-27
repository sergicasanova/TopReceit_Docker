import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { RecipeIngredient } from '../recipe_ingredient/recipe_ingredient.entity';
import { Steps } from 'src/steps/steps.entity';

@Entity('recipe')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

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
}
