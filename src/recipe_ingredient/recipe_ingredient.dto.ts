import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateRecipeIngredientDto {
  @IsNotEmpty()
  recipe_id: number;

  @IsNotEmpty()
  ingredient_id: number;

  @IsPositive()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  unit: string;
}

export class UpdateRecipeIngredientDto {
  @IsOptional()
  @IsPositive()
  ingredient_id?: number;

  @IsOptional()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;
}
