import { Injectable, NotFoundException } from '@nestjs/common';
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

  async createStep(
    recipeId: number,
    createStepDto: CreateStepDto,
  ): Promise<Steps> {
    const recipe = await this.recipeRepository.findOne({
      where: { id: recipeId },
      relations: ['steps'],
    });

    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }

    const step = this.stepsRepository.create({
      ...createStepDto,
      recipe,
    });

    const savedStep = await this.stepsRepository.save(step);

    const completeStep = await this.stepsRepository.findOne({
      where: { id: savedStep.id },
      relations: ['recipe'],
    });

    if (!completeStep) {
      throw new NotFoundException('Error al recuperar el paso creado');
    }

    return completeStep;
  }

  async getStepsByRecipe(recipeId: number): Promise<Steps[]> {
    const recipe = await this.recipeRepository.findOne({
      where: { id: recipeId },
    });
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }

    return this.stepsRepository.find({
      where: { recipe: { id: recipeId } },
      order: { order: 'ASC' },
    });
  }

  // Modificar un paso
  async updateStep(
    stepId: number,
    updateStepDto: UpdateStepDto,
  ): Promise<Steps> {
    const step = await this.stepsRepository.findOne({ where: { id: stepId } });
    if (!step) {
      throw new NotFoundException('Paso no encontrado');
    }

    Object.assign(step, updateStepDto);

    return this.stepsRepository.save(step);
  }

  // Eliminar un paso
  async deleteStep(stepId: number): Promise<void> {
    const result = await this.stepsRepository.delete(stepId);
    if (result.affected === 0) {
      throw new NotFoundException('Paso no encontrado');
    }
  }
}
