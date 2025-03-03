import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';
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

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indica si la receta es pública o privada',
    example: true,
    required: false,
  })
  is_public?: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'ID del usuario que creó la receta',
    example: 'user123',
  })
  user_id: string;

  @IsArray()
  @IsOptional()
  recipeIngredients?: CreateRecipeIngredientDto[];

  @IsArray()
  @IsOptional()
  steps?: CreateStepDto[];
}

export class UpdateRecipeDto {
  @IsString()
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

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Indica si la receta es pública o privada',
    example: true,
    required: false,
  })
  is_public?: boolean;

  @IsOptional()
  @IsArray()
  recipeIngredients?: CreateRecipeIngredientDto[];

  @IsOptional()
  @IsArray()
  steps?: CreateStepDto[];
}
