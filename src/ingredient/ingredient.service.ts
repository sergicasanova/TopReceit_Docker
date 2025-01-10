import { Injectable } from '@nestjs/common';
import { IngredientEntity } from './ingredient.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IngredientDto } from './ingredient.dto';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(IngredientEntity)
    private readonly ingredientRepository: Repository<IngredientEntity>,
  ) {}

  async getAllIngredients(): Promise<IngredientEntity[]> {
    return await this.ingredientRepository.find();
  }

  async getIngredientsByName(name: string): Promise<IngredientEntity[]> {
    return await this.ingredientRepository.find({
      where: { name: Like(`%${name}%`) },
    });
  }

  async createIngredient(
    ingredientDto: IngredientDto,
  ): Promise<IngredientEntity> {
    const ingredient = this.ingredientRepository.create(ingredientDto);
    return await this.ingredientRepository.save(ingredient);
  }

  async deleteIngredient(id: number): Promise<void> {
    const result = await this.ingredientRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Ingrediente no encontrado');
    }
  }
}
