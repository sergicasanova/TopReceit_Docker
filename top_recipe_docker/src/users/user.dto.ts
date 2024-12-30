import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  // @IsInt()
  // @IsOptional()
  // role?: number;

  // @IsArray()
  // @IsOptional()
  // preferences?: string[];

  // @IsString()
  // @IsOptional()
  // avatar?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  // @IsOptional()
  // @IsArray()
  // preferences?: string[];

  // @IsOptional()
  // @IsString()
  // avatar?: string;
}
