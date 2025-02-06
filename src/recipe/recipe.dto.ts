import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRecipeIngredientDto } from '../recipe_ingredient/recipe_ingredient.dto';
import { CreateStepDto } from '../steps/steps.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Título de la receta',
    example: 'Spaghetti Bolognese',
  })
  title: string;

  @IsString()
  @ApiProperty({
    description: 'Descripción de la receta',
    example: 'Una receta de pasta con salsa boloñesa',
  })
  description: string;

  @IsString()
  @ApiProperty({ description: 'Imagen de la receta', example: 'image_url' })
  image: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'ID del usuario que creó la receta',
    example: 'user123',
  })
  user_id: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  @ApiProperty({
    description: 'Lista de ingredientes',
    type: [CreateRecipeIngredientDto],
    required: false,
  })
  recipeIngredients?: CreateRecipeIngredientDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  @ApiProperty({
    description: 'Lista de pasos',
    type: [CreateStepDto],
    required: false,
  })
  steps?: CreateStepDto[];
}

export class UpdateRecipeDto {
  @IsString()
  @ApiProperty({ description: 'ID de la receta', example: '1' })
  id_recipe: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Título de la receta',
    example: 'Spaghetti Bolognese',
    required: false,
  })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Descripción de la receta',
    example: 'Una receta de pasta con salsa boloñesa',
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Imagen de la receta',
    example: 'image_url',
    required: false,
  })
  image?: string;

  @IsString()
  @ApiProperty({ description: 'ID del usuario', example: 'user123' })
  user_id: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  @ApiProperty({
    description: 'Lista de ingredientes',
    type: [CreateRecipeIngredientDto],
    required: false,
  })
  recipeIngredients?: CreateRecipeIngredientDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  @ApiProperty({
    description: 'Lista de pasos',
    type: [CreateStepDto],
    required: false,
  })
  steps?: CreateStepDto[];
}
