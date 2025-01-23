import { IsInt, IsString } from 'class-validator';

export class IngredientDto {
  @IsInt()
  id_ingredient?: number;

  @IsString()
  name: string;
}
