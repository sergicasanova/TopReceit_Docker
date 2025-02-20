import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'ID del usuario', example: 'user123' })
  user_id: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'ID de la receta', example: 1 })
  recipe_id: number;
}

export class RemoveFavoriteDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'ID del usuario', example: 'user123' })
  user_id: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'ID de la receta', example: 1 })
  recipe_id: number;
}
