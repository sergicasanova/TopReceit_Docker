import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Steps } from './steps.entity';
import { CreateStepDto } from './steps.dto';
import { UpdateStepDto } from './steps.dto';
import { Recipe } from '../recipe/recipe.entity';

@Injectable()
export class StepsService {
  constructor(
    @InjectRepository(Steps)
    private readonly stepsRepository: Repository<Steps>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  /**
   * Crea un nuevo paso para una receta específica.
   * Verifica que la receta exista antes de agregar el paso.
   * Valida que los datos requeridos estén presentes.
   */
  async createStep(
    recipeId: number,
    createStepDto: CreateStepDto,
  ): Promise<Steps> {
    const recipeExists = await this.recipeRepository.findOne({
      where: { id_recipe: recipeId },
    });
    if (!recipeExists) {
      throw new NotFoundException('Receta no encontrada');
    }

    if (!createStepDto.description || !createStepDto.order) {
      throw new BadRequestException('Faltan datos obligatorios para el paso');
    }

    const step = this.stepsRepository.create({
      ...createStepDto,
      recipe: { id_recipe: recipeId },
    });

    return await this.stepsRepository.save(step);
  }

  /**
   * Obtiene todos los pasos de una receta en orden ascendente.
   * Verifica que la receta exista antes de buscar los pasos.
   */
  async getStepsByRecipe(recipeId: number): Promise<Steps[]> {
    const recipeExists = await this.recipeRepository.findOne({
      where: { id_recipe: recipeId },
    });

    if (!recipeExists) {
      throw new NotFoundException('Receta no encontrada');
    }

    return this.stepsRepository.find({
      where: { recipe: { id_recipe: recipeId } },
      order: { order: 'ASC' },
    });
  }

  /**
   * Actualiza un paso específico por su ID.
   * Verifica que el paso exista antes de actualizarlo.
   */
  async updateStep(
    stepId: number,
    updateStepDto: UpdateStepDto,
  ): Promise<Steps> {
    const step = await this.stepsRepository.findOne({
      where: { id_steps: stepId },
    });

    if (!step) {
      throw new NotFoundException('Paso no encontrado');
    }

    Object.assign(step, updateStepDto);

    return this.stepsRepository.save(step);
  }

  /**
   * Elimina un paso de una receta específica.
   * Verifica que la receta y el paso existan antes de eliminarlos.
   */
  async deleteStep(stepId: number, recipeId: number): Promise<void> {
    const recipeExists = await this.recipeRepository.findOne({
      where: { id_recipe: recipeId },
    });

    if (!recipeExists) {
      throw new NotFoundException('Receta no encontrada');
    }

    const step = await this.stepsRepository.findOne({
      where: { id_steps: stepId, recipe: { id_recipe: recipeId } },
    });

    if (!step) {
      throw new NotFoundException('Paso no encontrado para esta receta');
    }

    const result = await this.stepsRepository.delete(step);

    if (result.affected === 0) {
      throw new NotFoundException('Paso no encontrado');
    }
  }

  /**
   * Elimina un paso por su ID sin importar la receta.
   */
  async deleteStepid(stepId: number): Promise<void> {
    const result = await this.stepsRepository.delete({ id_steps: stepId });
    if (result.affected === 0) {
      throw new NotFoundException('Paso no encontrado');
    }
  }
}
