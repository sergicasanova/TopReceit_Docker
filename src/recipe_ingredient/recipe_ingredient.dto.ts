import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipeIngredientDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'ID de la receta', example: 1 })
  recipe_id: number;

  @IsNotEmpty()
  @ApiProperty({ description: 'ID del ingrediente', example: 1 })
  ingredient_id: number;

  @IsPositive()
  @ApiProperty({ description: 'Cantidad del ingrediente', example: 100 })
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unidad de medida del ingrediente',
    example: 'gr',
  })
  unit: string;
}

export class UpdateRecipeIngredientDto {
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    description: 'ID del ingrediente',
    example: 1,
    required: false,
  })
  ingredient_id?: number;

  @IsOptional()
  @IsPositive()
  @ApiProperty({
    description: 'Cantidad del ingrediente',
    example: 100,
    required: false,
  })
  quantity?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Unidad de medida del ingrediente',
    example: 'gr',
    required: false,
  })
  unit?: string;
}
