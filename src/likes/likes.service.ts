import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './likes.entity';
import { NotificationService } from 'src/notification/notification.service';
import { User } from 'src/users/users.entity';
import { Recipe } from 'src/recipe/recipe.entity';
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

  async giveLike(userId: string, recipeId: number): Promise<Like> {
    const like = await this.likeRepository.findOne({
      where: { user: { id_user: userId }, recipe: { id_recipe: recipeId } },
      relations: ['user', 'recipe', 'recipe.user'],
    });

    if (like) {
      throw new Error('Ya has dado like a esta receta');
    }

    const newLike = this.likeRepository.create({
      user: { id_user: userId },
      recipe: { id_recipe: recipeId },
    });

    await this.likeRepository.save(newLike);

    // Obtener las entidades completas de usuario y receta
    const user = await this.userRepository.findOne({
      where: { id_user: userId },
    });
    const recipe = await this.recipeRepository.findOne({
      where: { id_recipe: recipeId },
      relations: ['user'],
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (!recipe) {
      throw new Error('Receta no encontrada');
    }

    const messageTitle = `Nuevo Like`;
    const messageBody = `${user.username} le ha dado like a la receta "${recipe.title}`;

    console.log(messageTitle, messageBody);

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

  async removeLike(userId: string, recipeId: number): Promise<void> {
    const like = await this.likeRepository.findOne({
      where: { user: { id_user: userId }, recipe: { id_recipe: recipeId } },
    });

    if (like) {
      await this.likeRepository.remove(like);
    } else {
      throw new Error('Like no encontrado');
    }
  }

  async countLikes(recipeId: number): Promise<number> {
    const likes = await this.likeRepository.find({
      where: { recipe: { id_recipe: recipeId } },
    });

    return likes.length;
  }

  async getLikes(recipeId: number): Promise<string[]> {
    const likes = await this.likeRepository.find({
      where: { recipe: { id_recipe: recipeId } },
      relations: ['user'],
    });

    return likes.map((like) => like.user.id_user);
  }
}
