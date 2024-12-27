import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { StepsService } from './steps.service';
import { CreateStepDto, UpdateStepDto } from './steps.dto';

@Controller('/steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post()
  async createStep(
    @Param('recipeId') recipeId: number,
    @Body() createStepDto: CreateStepDto,
  ) {
    return this.stepsService.createStep(recipeId, createStepDto);
  }

  @Get()
  async getSteps(@Param('recipeId') recipeId: number) {
    return this.stepsService.getStepsByRecipe(recipeId);
  }

  @Put(':stepId')
  async updateStep(
    @Param('stepId') stepId: number,
    @Body() updateStepDto: UpdateStepDto,
  ) {
    return this.stepsService.updateStep(stepId, updateStepDto);
  }

  @Delete(':stepId')
  async deleteStep(@Param('stepId') stepId: number) {
    return this.stepsService.deleteStep(stepId);
  }
}
