import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { IngredientEntity } from '../../../ingredient/ingredient.entity';
import ingredientData from '../../../data/ingredient';

export class IngredientSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const ingredientRepository = dataSource.getRepository(IngredientEntity);

    const ingredientToSave = await Promise.all(
      ingredientData.map(async (item) => {
        return {
          id: item.id_ingredient,
          name: item.name,
        };
      }),
    );
    await ingredientRepository.save(ingredientToSave);

    console.log('Inventari seeding completed!');
  }
}
