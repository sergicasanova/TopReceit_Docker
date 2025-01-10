import { IsString } from 'class-validator';

export class IngredientDto {
  @IsString()
  name: string;
}
