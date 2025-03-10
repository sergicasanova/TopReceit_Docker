import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStepDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Descripción del paso de la receta',
    example: 'Cortar los ingredientes',
  })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  recipe_id?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: 'Orden del paso dentro de la receta',
    example: 1,
  })
  order: number;
}

export class UpdateStepDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Descripción del paso',
    example: 'Cortar los ingredientes',
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: 'Orden del paso dentro de la receta',
    example: 2,
    required: false,
  })
  order?: number;
}
