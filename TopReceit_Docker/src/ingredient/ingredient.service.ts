import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IngredientEntity } from './ingredient.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IngredientDto } from './ingredient.dto';

@Injectable()
export class IngredientService {
  /**
   * Constructor del servicio
   * @param ingredientRepository Repositorio de ingredientes
   */
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

  /**
   * Crea un nuevo ingrediente si no existe.
   * @param ingredientDto Objeto de transferencia de datos del ingrediente
   * @returns El ingrediente recién creado
   * @throws BadRequestException si el ingrediente ya existe
   */
  async createIngredient(
    ingredientDto: IngredientDto,
  ): Promise<IngredientEntity> {
    const { name } = ingredientDto;

    const normalizedName = name.toLowerCase().replace(/\s+/g, '').trim();

    const existingIngredient = await this.ingredientRepository.findOne({
      where: { name: normalizedName },
    });

    if (existingIngredient) {
      throw new BadRequestException('Este ingrediente ya existe.');
    }

    const ingredient = this.ingredientRepository.create(ingredientDto);

    try {
      return await this.ingredientRepository.save(ingredient);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Hubo un problema al crear el ingrediente. Por favor, inténtelo nuevamente.',
      );
    }
  }

  /**
   * Elimina un ingrediente por su ID.
   * @param id El ID del ingrediente a eliminar
   * @returns Una promesa que se resuelve si el ingrediente se elimina correctamente
   * @throws NotFoundException si el ingrediente no se encuentra
   */
  async deleteIngredient(id: number): Promise<void> {
    const ingredient = await this.ingredientRepository.findOne({
      where: { id_ingredient: id },
    });

    if (!ingredient) {
      throw new NotFoundException('Ingrediente no encontrado');
    }

    await this.ingredientRepository.remove(ingredient);
  }
}
