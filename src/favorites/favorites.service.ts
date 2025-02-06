import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorites.entity';
import { NotificationService } from 'src/notification/notification.service';
import { User } from 'src/users/users.entity';
import { Recipe } from 'src/recipe/recipe.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private NotificationService: NotificationService,
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

    await this.favoriteRepository.save(favorite);

    // const user = await this.userRepository.findOne({
    //   where: { id_user: userId },
    // });
    // const recipe = await this.recipeRepository.findOne({
    //   where: { id_recipe: recipeId },
    //   relations: ['user'],
    // });

    // if (!user) {
    //   throw new Error('Usuario no encontrado');
    // }

    // if (!recipe) {
    //   throw new Error('Receta no encontrada');
    // }

    // const messageTitle = `Favorito añadido`;
    // const messageBody = `Has añadido la recet: ${recipe.title} a tus favoritos`;

    // console.log(messageTitle, messageBody);

    // const ownerToken = recipe.user?.notification_token;
    // if (ownerToken) {
    //   await this.NotificationService.sendPushNotification(
    //     ownerToken,
    //     messageTitle,
    //     messageBody,
    //   );
    // } else {
    //   console.log(
    //     'El propietario de la receta no tiene un token de notificación.',
    //   );
    // }
    return favorite;
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
