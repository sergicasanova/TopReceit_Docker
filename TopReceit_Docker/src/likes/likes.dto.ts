import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeDto {
  @IsString()
  @ApiProperty({ description: 'ID del usuario', example: 'user123' })
  userId: string;

  @IsInt()
  @ApiProperty({ description: 'ID de la receta', example: 1 })
  recipeId: number;
}

export class RemoveLikeDto {
  @IsString()
  @ApiProperty({ description: 'ID del usuario', example: 'user123' })
  userId: string;

  @IsInt()
  @ApiProperty({ description: 'ID de la receta', example: 1 })
  recipeId: number;
}
