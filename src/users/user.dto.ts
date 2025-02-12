import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  IsArray,
} from 'class-validator';
import { Favorite } from 'src/favorites/favorites.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'ID del usuario',
    example: 'user123',
    required: true,
  })
  id_user: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'user@example.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Nombre de usuario', example: 'john_doe' })
  username: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => value ?? 2)
  @ApiProperty({ description: 'Rol del usuario', example: 2, required: false })
  role?: number;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'Preferencias del usuario',
    example: ['carne', 'verduras', 'pescado'],
    required: false,
  })
  preferences?: string[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Avatar del usuario',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  id_user?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'user@example.com',
    required: false,
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'john_doe',
    required: false,
  })
  username?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    description: 'Preferencias del usuario',
    example: ['carne', 'verduras', 'pescado'],
    required: false,
  })
  preferences?: string[];

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Avatar del usuario',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Token de notificación del usuario',
    example: 'some-token',
    required: false,
  })
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
