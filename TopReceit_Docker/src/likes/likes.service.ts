import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './likes.entity';
import { NotificationService } from '../notification/notification.service';
import { User } from '../users/users.entity';
import { Recipe } from '../recipe/recipe.entity';
@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
    private NotificationService: NotificationService,
  ) {}

  /**
   * Registra un like a una receta por parte de un usuario.
   *
   * Verifica que el usuario y la receta existan antes de registrar el like.
   * Lanza un error `NotFoundException` si el usuario o la receta no existen.
   * Lanza un error `BadRequestException` si el usuario ya dio like a la receta.
   *
   * Envia una notificacion push al propietario de la receta si tiene un token de notificacion.
   * @param userId El ID del usuario que da like.
   * @param recipeId El ID de la receta a la que se da like.
   * @returns El like registrado.
   */
  async giveLike(userId: string, recipeId: number): Promise<Like> {
    const userExists = await this.userRepository.findOne({
      where: { id_user: userId },
    });
    if (!userExists) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const recipe = await this.recipeRepository.findOne({
      where: { id_recipe: recipeId },
      relations: ['user'],
    });
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { user: { id_user: userId }, recipe: { id_recipe: recipeId } },
    });
    if (existingLike) {
      throw new BadRequestException('Ya has dado like a esta receta');
    }

    const newLike = this.likeRepository.create({
      user: { id_user: userId },
      recipe: { id_recipe: recipeId },
    });
    await this.likeRepository.save(newLike);

    const messageTitle = `Nuevo Like`;
    const messageBody = `${userExists.username} le ha dado like a la receta "${recipe.title}"`;

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
    return newLike;
  }

  /**
   * Quita un like de una receta por parte de un usuario.
   *
   * Verifica que el usuario y la receta existan antes de quitar el like.
   * Lanza un error `NotFoundException` si el usuario o la receta no existen.
   * Lanza un error `BadRequestException` si el like no existe para la receta y usuario.
   * @param userId El ID del usuario que da like.
   * @param recipeId El ID de la receta a la que se da like.
   */
  async removeLike(userId: string, recipeId: number): Promise<void> {
    const userExists = await this.userRepository.findOne({
      where: { id_user: userId },
    });
    if (!userExists) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const recipe = await this.recipeRepository.findOne({
      where: { id_recipe: recipeId },
    });
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }
    const like = await this.likeRepository.findOne({
      where: { user: { id_user: userId }, recipe: { id_recipe: recipeId } },
    });

    if (!like) {
      throw new BadRequestException(
        'El like no existe para esta receta y usuario',
      );
    }
    await this.likeRepository.remove(like);
  }

  /**
   * Devuelve el numero de likes que tiene una receta.
   * @param recipeId El ID de la receta.
   * @returns El numero de likes.
   */
  async countLikes(recipeId: number): Promise<number> {
    const likes = await this.likeRepository.find({
      where: { recipe: { id_recipe: recipeId } },
    });

    return likes.length;
  }

  /**
   * Recupera la lista de IDs de usuarios que han dado like a una receta especifica.
   *
   * @param recipeId El ID de la receta cuyos likes se estan recuperando.
   * @returns Un array de IDs de usuarios que dieron like a la receta.
   */
  async getLikes(recipeId: number): Promise<string[]> {
    const likes = await this.likeRepository.find({
      where: { recipe: { id_recipe: recipeId } },
      relations: ['user'],
    });

    return likes.map((like) => like.user.id_user);
  }
}
