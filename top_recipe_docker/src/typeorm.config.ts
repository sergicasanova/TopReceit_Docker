import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { IngredientEntity } from './ingredient/ingredient.entity';
import { User } from './users/users.entity';

dotenv.config();

const config = {
  type: 'mysql',
  host: 'topReceit-db',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [IngredientEntity, User],
  migrations: [],
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
