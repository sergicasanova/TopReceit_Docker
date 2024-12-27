import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { config } from 'dotenv';
import { UploadEntity } from './upload/upload.entity';
import { IngredientEntity } from './ingredient/ingredient.entity';
import { IngredientSeeder } from './db/seeding/seeds/IngredientSeed';
config();

const options: DataSourceOptions & SeederOptions = {
  type: 'mariadb',
  host: 'topReceit-db',
  port: 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,

  entities: [IngredientEntity, UploadEntity],
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
