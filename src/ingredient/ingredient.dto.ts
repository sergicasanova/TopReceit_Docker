import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IngredientDto {
  @IsInt()
  id_ingredient?: number;

  @IsString()
  @ApiProperty({ description: 'Nombre del ingrediente', example: 'Tomate' })
  name: string;
}
