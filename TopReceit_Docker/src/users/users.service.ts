import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private NotificationService: NotificationService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      if (
        !createUserDto.username ||
        !createUserDto.email ||
        !createUserDto.id_user
      ) {
        throw new NotFoundException(
          'El nombre de usuario, correo electrónico y ID son obligatorios',
        );
      }

      const existingUser = await this.userRepository.findOne({
        where: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      });

      if (existingUser) {
        throw new ConflictException(
          'El nombre de usuario o el correo electrónico ya están en uso',
        );
      }

      const newUser = this.userRepository.create(createUserDto);
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      console.error(error);
      throw new InternalServerErrorException(
        'Hubo un problema al crear el usuario. Por favor, inténtelo nuevamente.',
      );
    }
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id_user: updateUserDto.id_user },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    this.userRepository.merge(user, updateUserDto);

    let updatedUser: User;
    try {
      updatedUser = await this.userRepository.save(user);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Hubo un problema al actualizar los datos del usuario. Por favor, inténtelo nuevamente.',
      );
    }

    // let messageBody = '';
    // const messageTitle = `Tus datos se han actualizado`;

    // if (oldUserData.username !== updatedUser.username) {
    //   messageBody += `Tu nombre de usuario ha sido cambiado a "${updatedUser.username}". `;
    // }
    // if (oldUserData.avatar !== updatedUser.avatar) {
    //   messageBody += `Tu avatar ha sido actualizado. `;
    // }
    // if (oldUserData.preferences.join() !== updatedUser.preferences?.join()) {
    //   messageBody += `Tus preferencias han sido actualizadas. `;
    // }

    // if (messageBody) {
    //   const token = updatedUser.notification_token;
    //   if (token) {
    //     try {
    //       await this.NotificationService.sendPushNotification(
    //         token,
    //         messageTitle,
    //         messageBody,
    //       );
    //     } catch (notificationError) {
    //       console.error('Error al enviar la notificación:', notificationError);
    //     }
    //   } else {
    //     console.log('El usuario no tiene un token de notificación.');
    //   }
    // }

    return updatedUser;
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id_user: id },
      relations: ['favorites', 'favorites.recipe', 'following', 'followers'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async removeUser(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id_user: id } });
    if (user) {
      await this.userRepository.remove(user);
    } else {
      throw new Error('User not found');
    }
  }

  async updateNotificationToken(
    id: string,
    tokenNotificacion: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id_user: id } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.notification_token = tokenNotificacion;

    return this.userRepository.save(user);
  }

  async getAllUsers(): Promise<any[]> {
    const users = await this.userRepository.find({
      select: ['id_user', 'username', 'avatar', 'preferences'], // Seleccionar solo los campos necesarios
    });

    return users;
  }

  async getUserProfile(id: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id_user: id },
      relations: ['recipes', 'recipes.recipeIngredients', 'recipes.steps'], // Cargar recetas y sus relaciones
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Filtrar las recetas publicadas
    const publishedRecipes = user.recipes.filter((recipe) => recipe.isPublic);

    // Devolver los datos del usuario junto con las recetas publicadas y sus relaciones
    return {
      id_user: user.id_user,
      username: user.username,
      avatar: user.avatar,
      preferences: user.preferences,
      publishedRecipes: publishedRecipes, // Devolver las recetas directamente
    };
  }
}
