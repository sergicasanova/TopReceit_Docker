import {
  IsNotEmpty,
  IsString,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateStepDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  recipe_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  order: number;
}

export class UpdateStepDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  recipe_id: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  order?: number;
}
