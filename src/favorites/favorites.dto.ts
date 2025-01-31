import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateFavoriteDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsNumber()
  recipe_id: number;
}

export class RemoveFavoriteDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsNumber()
  recipe_id: number;
}
