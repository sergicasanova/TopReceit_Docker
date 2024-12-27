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
  @Min(1)
  order: number;
}

export class UpdateStepDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  order?: number;
}
