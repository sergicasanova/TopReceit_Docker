import {
  Controller,
  Post,
  Delete,
  Param,
  Get,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto, RemoveFavoriteDto } from './favorites.dto';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @ApiOperation({ summary: 'Añadir una receta a los favoritos' })
  @ApiResponse({
    status: 201,
    description: 'Receta añadida a favoritos con éxito',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta',
  })
  @ApiBody({ type: CreateFavoriteDto })
  async addFavorite(@Body() createFavoriteDto: CreateFavoriteDto) {
    if (!createFavoriteDto.user_id || !createFavoriteDto.recipe_id) {
      throw new BadRequestException('Faltan parámetros en la solicitud');
    }

    return this.favoritesService.addFavorite(
      createFavoriteDto.user_id,
      createFavoriteDto.recipe_id,
    );
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar una receta de los favoritos' })
  @ApiResponse({
    status: 200,
    description: 'Receta eliminada de favoritos con éxito',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta',
  })
  @ApiBody({ type: RemoveFavoriteDto })
  @Post('remove')
  async removeFavorite(@Body() removeFavoriteDto: RemoveFavoriteDto) {
    if (!removeFavoriteDto.user_id || !removeFavoriteDto.recipe_id) {
      throw new BadRequestException('Faltan parámetros en la solicitud');
    }

    return this.favoritesService.removeFavorite(
      removeFavoriteDto.user_id,
      removeFavoriteDto.recipe_id,
    );
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Obtener los favoritos de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Favoritos del usuario obtenidos con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  getFavorites(@Param('userId') userId: string) {
    return this.favoritesService.getFavorites(userId);
  }
}
