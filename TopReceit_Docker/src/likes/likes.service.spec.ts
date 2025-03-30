import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeService } from './likes.service';
import { Like } from './likes.entity';
import { User } from '../users/users.entity';
import { Recipe } from '../recipe/recipe.entity';
import { NotificationService } from '../notification/notification.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('LikeService', () => {
  let service: LikeService;
  let likeRepository: Repository<Like>;
  let userRepository: Repository<User>;
  let recipeRepository: Repository<Recipe>;
  let notificationService: NotificationService;

  // Mock data
  const mockUser: User = {
    id_user: 'user123',
    username: 'testuser',
    notification_token: 'token123',
  } as User;

  const mockRecipe: Recipe = {
    id_recipe: 1,
    title: 'Test Recipe',
    user: mockUser,
  } as Recipe;

  const mockLike: Like = {
    id_like: 1,
    user: mockUser,
    recipe: mockRecipe,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
        {
          provide: getRepositoryToken(Like),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Recipe),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            sendPushNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LikeService>(LikeService);
    likeRepository = module.get<Repository<Like>>(getRepositoryToken(Like));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    recipeRepository = module.get<Repository<Recipe>>(
      getRepositoryToken(Recipe),
    );
    notificationService = module.get<NotificationService>(NotificationService);
  });

  describe('giveLike', () => {
    it('should successfully add a like', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(mockRecipe);
      jest.spyOn(likeRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(likeRepository, 'create').mockReturnValue(mockLike);
      jest.spyOn(likeRepository, 'save').mockResolvedValue(mockLike);
      jest
        .spyOn(notificationService, 'sendPushNotification')
        .mockResolvedValue(undefined);

      const result = await service.giveLike('user123', 1);

      expect(result).toEqual(mockLike);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id_user: 'user123' },
      });
      expect(recipeRepository.findOne).toHaveBeenCalledWith({
        where: { id_recipe: 1 },
        relations: ['user'],
      });
      expect(likeRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: { id_user: 'user123' },
          recipe: { id_recipe: 1 },
        },
      });
      expect(notificationService.sendPushNotification).toHaveBeenCalledWith(
        'token123',
        'Nuevo Like',
        'testuser le ha dado like a la receta "Test Recipe"',
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.giveLike('nonexistent', 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if recipe does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(null);

      await expect(service.giveLike('user123', 999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if like already exists', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(mockRecipe);
      jest.spyOn(likeRepository, 'findOne').mockResolvedValue(mockLike);

      await expect(service.giveLike('user123', 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should not send notification if owner has no token', async () => {
      const userWithoutToken = { ...mockUser, notification_token: null };
      const recipeWithUserWithoutToken = {
        ...mockRecipe,
        user: userWithoutToken,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(recipeRepository, 'findOne')
        .mockResolvedValue(recipeWithUserWithoutToken);
      jest.spyOn(likeRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(likeRepository, 'create').mockReturnValue(mockLike);
      jest.spyOn(likeRepository, 'save').mockResolvedValue(mockLike);

      const result = await service.giveLike('user123', 1);

      expect(result).toEqual(mockLike);
      expect(notificationService.sendPushNotification).not.toHaveBeenCalled();
    });
  });

  describe('removeLike', () => {
    it('should successfully remove a like', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(mockRecipe);
      jest.spyOn(likeRepository, 'findOne').mockResolvedValue(mockLike);
      jest.spyOn(likeRepository, 'remove').mockResolvedValue(null);

      await service.removeLike('user123', 1);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id_user: 'user123' },
      });
      expect(recipeRepository.findOne).toHaveBeenCalledWith({
        where: { id_recipe: 1 },
      });
      expect(likeRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: { id_user: 'user123' },
          recipe: { id_recipe: 1 },
        },
      });
      expect(likeRepository.remove).toHaveBeenCalledWith(mockLike);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.removeLike('nonexistent', 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if recipe does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(null);

      await expect(service.removeLike('user123', 999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if like does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(mockRecipe);
      jest.spyOn(likeRepository, 'findOne').mockResolvedValue(null);

      await expect(service.removeLike('user123', 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getLikes', () => {
    it('should return user IDs who liked the recipe', async () => {
      // Creamos usuarios mock completos que cumplan con la interfaz User
      const mockUser1: User = {
        id_user: 'user1',
        username: 'user1',
        email: 'user1@example.com',
        // ... otras propiedades requeridas por User
      } as User;

      const mockUser2: User = {
        id_user: 'user2',
        username: 'user2',
        email: 'user2@example.com',
        // ... otras propiedades requeridas por User
      } as User;

      // Creamos likes mock completos
      const mockLike1: Like = {
        id_like: 1,
        user: mockUser1,
        recipe: mockRecipe,
      };

      const mockLike2: Like = {
        id_like: 2,
        user: mockUser2,
        recipe: mockRecipe,
      };

      jest
        .spyOn(likeRepository, 'find')
        .mockResolvedValue([mockLike1, mockLike2]);

      const result = await service.getLikes(1);

      expect(result).toEqual(['user1', 'user2']);
      expect(likeRepository.find).toHaveBeenCalledWith({
        where: { recipe: { id_recipe: 1 } },
        relations: ['user'],
      });
    });

    it('should return empty array if recipe has no likes', async () => {
      jest.spyOn(likeRepository, 'find').mockResolvedValue([]);

      const result = await service.getLikes(1);

      expect(result).toEqual([]);
    });
  });
});
