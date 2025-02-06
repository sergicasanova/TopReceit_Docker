import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IngredientDto {
  @IsInt()
  @ApiProperty({
    description: 'ID del ingrediente',
    example: 1,
    required: false,
  })
  id_ingredient?: number;

  @IsString()
  @ApiProperty({ description: 'Nombre del ingrediente', example: 'Tomate' })
  name: string;
}
