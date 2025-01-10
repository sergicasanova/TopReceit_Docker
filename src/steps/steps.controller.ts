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

@Controller('steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post(':recipeId')
  async createStep(
    @Param('recipeId') recipeId: number,
    @Body() createStepDto: CreateStepDto,
  ) {
    return this.stepsService.createStep(recipeId, createStepDto);
  }

  @Get(':recipeId')
  async getSteps(@Param('recipeId') recipeId: number) {
    return this.stepsService.getStepsByRecipe(recipeId);
  }

  @Put(':recipeId/:stepId')
  async updateStep(
    @Param('recipeId') recipeId: number,
    @Param('stepId') stepId: number,
    @Body() updateStepDto: UpdateStepDto,
  ) {
    return this.stepsService.updateStep(recipeId, stepId, updateStepDto);
  }

  @Delete(':recipeId/:stepId')
  async deleteStep(
    @Param('recipeId') recipeId: number,
    @Param('stepId') stepId: number,
  ) {
    return this.stepsService.deleteStep(stepId, recipeId);
  }

  @Delete(':stepId')
  async deleteStepid(@Param('stepId') stepId: number) {
    return this.stepsService.deleteStepid(stepId);
  }
}
