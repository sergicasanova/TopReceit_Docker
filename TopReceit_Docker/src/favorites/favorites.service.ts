import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorites.entity';
import { NotificationService } from '../notification/notification.service';
import { User } from '../users/users.entity';
import { Recipe } from '../recipe/recipe.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    @Optional()
    private NotificationService: NotificationService,
  ) {}

  /**
   * A ade una receta a los favoritos de un usuario.
   *
   * Verifica que el usuario y la receta existan antes de agregar el favorito.
   * Lanza un error `BadRequestException` si el usuario ya tiene la receta en sus favoritos.
   * Lanza un error `NotFoundException` si el usuario o la receta no existen.
   * Envia una notificacion push al propietario de la receta si tiene un token de notificaci n.
   * @param userId El ID del usuario que agrega la receta a sus favoritos.
   * @param recipeId El ID de la receta a agregar.
   * @returns El favorito agregado.
   */
  async addFavorite(userId: string, recipeId: number): Promise<Favorite> {
    const existingFavorite = await this.favoriteRepository.findOne({
      where: { user: { id_user: userId }, recipe: { id_recipe: recipeId } },
    });

    if (existingFavorite) {
      throw new BadRequestException('Esta receta ya está en tus favoritos');
    }

    const recipe = await this.recipeRepository.findOne({
      where: { id_recipe: recipeId },
      relations: ['user'],
    });

    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }

    if (recipe.user.id_user !== userId) {
      throw new NotFoundException('Esta receta no pertenece al usuario');
    }

    const favorite = this.favoriteRepository.create({
      user: { id_user: userId },
      recipe: { id_recipe: recipeId },
    });

    await this.favoriteRepository.save(favorite);

    const messageTitle = `Favorito añadido`;
    const messageBody = `Has añadido la receta: ${recipe.title} a tus favoritos`;

    const ownerToken = recipe.user?.notification_token;
    if (ownerToken) {
      await this.NotificationService.sendPushNotification(
        ownerToken,
        messageTitle,
        messageBody,
      );
    } else {
      console.log(
        'El propietario de la receta no tiene un token de notificación.',
      );
    }

    return favorite;
  }

  /**
   * Elimina una receta de los favoritos de un usuario.
   *
   * Verifica que la receta exista y pertenezca al usuario antes de eliminarla
   * de los favoritos. Lanza un error `NotFoundException` si la receta
   * no se encuentra o no está en los favoritos. Lanza un error
   * `BadRequestException` si la receta no pertenece al usuario.
   *
   * @param userId El ID del usuario que elimina la receta de sus favoritos.
   * @param recipeId El ID de la receta a eliminar de los favoritos.
   */
  async removeFavorite(userId: string, recipeId: number): Promise<void> {
    const recipe = await this.recipeRepository.findOne({
      where: { id_recipe: recipeId },
      relations: ['user'],
    });

    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }

    if (recipe.user.id_user !== userId) {
      throw new BadRequestException('Esta receta no pertenece al usuario');
    }

    const favorite = await this.favoriteRepository.findOne({
      where: { user: { id_user: userId }, recipe: { id_recipe: recipeId } },
    });

    if (favorite) {
      await this.favoriteRepository.remove(favorite);
    } else {
      throw new NotFoundException('Receta no encontrada en favoritos');
    }
  }

  /**
   * Obtiene las recetas favoritas de un usuario.
   *
   * Verifica que el usuario exista antes de obtener las recetas favoritas.
   * Lanza un error `NotFoundException` si el usuario no existe.
   *
   * @param userId El ID del usuario cuyas recetas favoritas se quieren obtener.
   * @returns Un array de IDs de recetas favoritas del usuario.
   */
  async getFavorites(userId: string): Promise<any[]> {
    const userExists = await this.userRepository.findOne({
      where: { id_user: userId },
    });
    if (!userExists) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const favorites = await this.favoriteRepository.find({
      where: { user: { id_user: userId } },
      relations: ['recipe'],
    });
    return favorites.map((favorite) => favorite.recipe.id_recipe);
  }
}
