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
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('steps')
@Controller('steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post(':recipeId')
  @ApiOperation({ summary: 'Crear un paso para una receta' })
  @ApiResponse({
    status: 201,
    description: 'Paso creado con éxito',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta',
  })
  @ApiBody({ type: CreateStepDto })
  @ApiParam({
    name: 'recipeId',
    description: 'ID de la receta a la que pertenece el paso',
  })
  async createStep(
    @Param('recipeId') recipeId: number,
    @Body() createStepDto: CreateStepDto,
  ) {
    return this.stepsService.createStep(recipeId, createStepDto);
  }

  @Get(':recipeId')
  @ApiOperation({ summary: 'Obtener los pasos de una receta' })
  @ApiResponse({
    status: 200,
    description: 'Pasos obtenidos con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Receta no encontrada',
  })
  @ApiParam({ name: 'recipeId', description: 'ID de la receta' })
  async getSteps(@Param('recipeId') recipeId: number) {
    return this.stepsService.getStepsByRecipe(recipeId);
  }

  @Put(':recipeId/:stepId')
  @ApiOperation({ summary: 'Actualizar un paso de una receta' })
  @ApiResponse({
    status: 200,
    description: 'Paso actualizado con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Receta o paso no encontrados',
  })
  @ApiParam({ name: 'recipeId', description: 'ID de la receta' })
  @ApiParam({ name: 'stepId', description: 'ID del paso' })
  @ApiBody({ type: UpdateStepDto })
  async updateStep(
    @Param('recipeId') recipeId: number,
    @Param('stepId') stepId: number,
    @Body() updateStepDto: UpdateStepDto,
  ) {
    return this.stepsService.updateStep(recipeId, stepId, updateStepDto);
  }

  @Delete(':recipeId/:stepId')
  @ApiOperation({ summary: 'Eliminar un paso de una receta' })
  @ApiResponse({
    status: 200,
    description: 'Paso eliminado con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Receta o paso no encontrados',
  })
  @ApiParam({ name: 'recipeId', description: 'ID de la receta' })
  @ApiParam({ name: 'stepId', description: 'ID del paso' })
  async deleteStep(
    @Param('recipeId') recipeId: number,
    @Param('stepId') stepId: number,
  ) {
    return this.stepsService.deleteStep(stepId, recipeId);
  }

  @Delete(':stepId')
  @ApiOperation({ summary: 'Eliminar un paso de receta por ID' })
  @ApiResponse({
    status: 200,
    description: 'Paso eliminado con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Paso no encontrado',
  })
  @ApiParam({ name: 'stepId', description: 'ID del paso' })
  async deleteStepid(@Param('stepId') stepId: number) {
    return this.stepsService.deleteStepid(stepId);
  }
}
