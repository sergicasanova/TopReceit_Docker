import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/users.entity';
import * as dotenv from 'dotenv';
import { Recipe } from './recipe/recipe.entity';
import { IngredientEntity } from './ingredient/ingredient.entity';
import { RecipeIngredient } from './recipe_ingredient/recipe_ingredient.entity';
import { Steps } from './steps/steps.entity';
import { Favorite } from './favorites/favorites.entity';

dotenv.config();

const config = {
  type: 'mysql',
  host: 'database',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [User, Recipe, IngredientEntity, RecipeIngredient, Steps, Favorite],
  migrations: ['./src/migrations/*.ts'],
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
