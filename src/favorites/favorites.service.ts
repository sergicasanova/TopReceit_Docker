import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorites.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  async addFavorite(userId: string, recipeId: number): Promise<Favorite> {
    const existingFavorite = await this.favoriteRepository.findOne({
      where: { user: { id_user: userId }, recipe: { id_recipe: recipeId } },
    });

    if (existingFavorite) {
      throw new Error('Esta receta ya está en tus favoritos');
    }

    const favorite = this.favoriteRepository.create({
      user: { id_user: userId },
      recipe: { id_recipe: recipeId },
    });

    return this.favoriteRepository.save(favorite);
  }

  async removeFavorite(userId: string, recipeId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: { user: { id_user: userId }, recipe: { id_recipe: recipeId } },
    });

    if (favorite) {
      await this.favoriteRepository.remove(favorite);
    } else {
      throw new Error('Receta no encontrada en favoritos');
    }
  }

  async getFavorites(userId: string): Promise<any[]> {
    const favorites = await this.favoriteRepository.find({
      where: { user: { id_user: userId } },
      relations: ['recipe'],
    });

    return favorites.map((favorite) => favorite.recipe.id_recipe);
  }
}
