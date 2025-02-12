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
