import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { config } from 'dotenv';
import { IngredientEntity } from './ingredient/ingredient.entity';
import { RecipeIngredient } from './recipe_ingredient/recipe_ingredient.entity';
import { Recipe } from './recipe/recipe.entity';
import { IngredientSeeder } from './db/seeding/seeds/IngredientSeed';
import { User } from './users/users.entity';
import { Steps } from './steps/steps.entity';
import { Favorite } from './favorites/favorites.entity';
import { Like } from './likes/likes.entity';

config();

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [
    IngredientEntity,
    RecipeIngredient,
    Recipe,
    User,
    Steps,
    Favorite,
    Like,
  ],
  seeds: [IngredientSeeder],
};

const dataSource = new DataSource(options);

dataSource
  .initialize()
  .then(async () => {
    await dataSource.synchronize(true);
    await runSeeders(dataSource);
    process.exit();
  })
  .catch((error) => console.log('Error initializing data source', error));
