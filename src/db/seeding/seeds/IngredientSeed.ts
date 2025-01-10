import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { IngredientEntity } from '../../../ingredient/ingredient.entity';
import ingredientData from '../../../data/ingredient';

export class IngredientSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const ingredientRepository = dataSource.getRepository(IngredientEntity);

    try {
      const existingIngredients = await ingredientRepository.find();
      const existingIds = existingIngredients.map(
        (ingredient) => ingredient.id_ingredient,
      );

      const ingredientsToSave = ingredientData
        .filter((item) => !existingIds.includes(item.id_ingredient))
        .map((item) => ({
          id: item.id_ingredient,
          name: item.name,
        }));
      await ingredientRepository.save(ingredientsToSave);
    } catch (error) {
      console.error('Error during seeding:', error);
    }
  }
}
