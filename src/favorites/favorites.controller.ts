import { Controller, Post, Delete, Param, Get, Body } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto, RemoveFavoriteDto } from './favorites.dto';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  addFavorite(@Body() createFavoriteDto: CreateFavoriteDto) {
    return this.favoritesService.addFavorite(
      createFavoriteDto.user_id,
      createFavoriteDto.recipe_id,
    );
  }

  // Eliminar receta de favoritos
  @Delete()
  removeFavorite(@Body() removeFavoriteDto: RemoveFavoriteDto) {
    return this.favoritesService.removeFavorite(
      removeFavoriteDto.user_id,
      removeFavoriteDto.recipe_id,
    );
  }

  // Obtener favoritos de un usuario
  @Get(':userId')
  getFavorites(@Param('userId') userId: string) {
    return this.favoritesService.getFavorites(userId);
  }
}
