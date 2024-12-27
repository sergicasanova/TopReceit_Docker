import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateRecipeIngredientDto {
  @IsNotEmpty()
  recipeId: number;

  @IsNotEmpty()
  ingredientId: number;

  @IsPositive()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  unit: string;
}

export class UpdateRecipeIngredientDto {
  @IsOptional()
  @IsPositive()
  ingredient?: number;

  @IsOptional()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;
}
