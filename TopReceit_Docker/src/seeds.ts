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
import { ShoppingList } from './shopping_list/shopping_list.entity';
import { ShoppingListItem } from './shopping_list/shopping_list_item.entity';
import { Follow } from './follow/follow.entity';

config();

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: 'database',
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
    ShoppingList,
    ShoppingListItem,
    Follow,
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
