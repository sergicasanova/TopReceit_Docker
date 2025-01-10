import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Steps } from './steps.entity';
import { CreateStepDto } from './steps.dto';
import { UpdateStepDto } from './steps.dto';

@Injectable()
export class StepsService {
  constructor(
    @InjectRepository(Steps)
    private readonly stepsRepository: Repository<Steps>,
  ) {}

  async createStep(
    recipeId: number,
    createStepDto: CreateStepDto,
  ): Promise<Steps> {
    const step = this.stepsRepository.create({
      ...createStepDto,
      recipe: { id_recipe: recipeId },
    });

    const savedStep = await this.stepsRepository.save(step);
    return savedStep;
  }

  async getStepsByRecipe(recipeId: number): Promise<Steps[]> {
    return this.stepsRepository.find({
      where: { recipe: { id_recipe: recipeId } },
      order: { order: 'ASC' },
    });
  }

  async updateStep(
    recipeId: number,
    stepId: number,
    updateStepDto: UpdateStepDto,
  ): Promise<Steps> {
    const step = await this.stepsRepository.findOne({
      where: { id_steps: stepId, recipe: { id_recipe: recipeId } },
    });
    if (!step) {
      throw new NotFoundException('Paso no encontrado para esta receta');
    }
    Object.assign(step, updateStepDto);

    return this.stepsRepository.save(step);
  }

  async deleteStep(stepId: number, recipeId: number): Promise<void> {
    const step = await this.stepsRepository.findOne({
      where: { id_steps: stepId, recipe: { id_recipe: recipeId } },
    });
    const result = await this.stepsRepository.delete(step);
    if (result.affected === 0) {
      throw new NotFoundException('Paso no encontrado');
    }
  }

  async deleteStepid(stepId: number): Promise<void> {
    const result = await this.stepsRepository.delete({ id_steps: stepId });
    if (result.affected === 0) {
      throw new NotFoundException('Paso no encontrado');
    }
  }
}
