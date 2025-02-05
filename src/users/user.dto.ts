import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  IsArray,
} from 'class-validator';
import { Favorite } from 'src/favorites/favorites.entity';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  id_user: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsInt()
  @IsOptional()
  role?: number;

  @IsArray()
  @IsOptional()
  preferences?: string[];

  @IsString()
  @IsOptional()
  avatar?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  id_user?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsArray()
  preferences?: string[];

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  notification_token?: string;
}

export class UserWithFavoritesDto {
  @IsString()
  id_user: string;

  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsOptional()
  favorites: Favorite[];
}
