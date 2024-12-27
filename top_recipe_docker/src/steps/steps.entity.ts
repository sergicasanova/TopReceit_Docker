import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Recipe } from '../recipe/recipe.entity';

@Entity('steps')
export class Steps {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.steps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @Column()
  description: string;

  @Column()
  order: number;
}
