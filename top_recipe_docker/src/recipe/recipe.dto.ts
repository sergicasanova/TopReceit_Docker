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

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  recipeIngredients: CreateRecipeIngredientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  steps: CreateStepDto[];
}

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  recipeIngredients?: CreateRecipeIngredientDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  steps?: CreateStepDto[];
}
