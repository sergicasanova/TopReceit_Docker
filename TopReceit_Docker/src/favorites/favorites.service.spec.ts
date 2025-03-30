import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoritesService } from './favorites.service';
import { Favorite } from './favorites.entity';
import { User } from '../users/users.entity';
import { Recipe } from '../recipe/recipe.entity';
import { NotificationService } from '../notification/notification.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Helper functions to create complete mock entities
const createMockUser = (overrides: Partial<User> = {}): User => {
  return {
    id_user: 'user123',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedpassword',
    avatar: 'avatar.jpg',
    preferences: {},
    token: 'token',
    tokenExpiration: new Date(),
    recipes: [],
    favorites: [],
    following: [],
    followers: [],
    likes: [],
    notification_token: 'token123',
    ...overrides,
  } as User;
};

const createMockRecipe = (overrides: Partial<Recipe> = {}): Recipe => {
  return {
    id_recipe: 1,
    title: 'Test Recipe',
    description: 'Test Description',
    image: 'test.jpg',
    preparation_time: 30,
    cooking_time: 20,
    difficulty: 'medium',
    isPublic: true,
    created_at: new Date(),
    updated_at: new Date(),
    user: createMockUser(),
    recipeIngredients: [],
    steps: [],
    favorites: [],
    likes: [],
    ...overrides,
  } as Recipe;
};

const createMockFavorite = (overrides: Partial<Favorite> = {}): Favorite => {
  return {
    id_favorite: 1,
    user: createMockUser(),
    recipe: createMockRecipe(),
    created_at: new Date(),
    ...overrides,
  } as Favorite;
};

describe('FavoritesService', () => {
  let service: FavoritesService;
  let favoriteRepository: Repository<Favorite>;
  let userRepository: Repository<User>;
  let recipeRepository: Repository<Recipe>;
  let notificationService: NotificationService;

  // Create complete mock entities
  const mockUser = createMockUser();
  const mockRecipe = createMockRecipe({ user: mockUser });
  const mockFavorite = createMockFavorite({
    user: mockUser,
    recipe: mockRecipe,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
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

    service = module.get<FavoritesService>(FavoritesService);
    favoriteRepository = module.get<Repository<Favorite>>(
      getRepositoryToken(Favorite),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    recipeRepository = module.get<Repository<Recipe>>(
      getRepositoryToken(Recipe),
    );
    notificationService = module.get<NotificationService>(NotificationService);
  });

  describe('addFavorite', () => {
    it('should add a recipe to favorites successfully', async () => {
      jest.spyOn(favoriteRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(mockRecipe);
      jest.spyOn(favoriteRepository, 'create').mockReturnValue(mockFavorite);
      jest.spyOn(favoriteRepository, 'save').mockResolvedValue(mockFavorite);
      jest
        .spyOn(notificationService, 'sendPushNotification')
        .mockResolvedValue(undefined);

      const result = await service.addFavorite('user123', 1);

      expect(result).toEqual(mockFavorite);
      expect(favoriteRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id_user: 'user123' }, recipe: { id_recipe: 1 } },
      });
      expect(notificationService.sendPushNotification).toHaveBeenCalledWith(
        'token123',
        'Favorito añadido',
        'Has añadido la receta: Test Recipe a tus favoritos',
      );
    });

    it('should throw BadRequestException if recipe is already favorited', async () => {
      jest.spyOn(favoriteRepository, 'findOne').mockResolvedValue(mockFavorite);

      await expect(service.addFavorite('user123', 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if recipe does not exist', async () => {
      jest.spyOn(favoriteRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(null);

      await expect(service.addFavorite('user123', 999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if recipe does not belong to user', async () => {
      const otherUser = createMockUser({ id_user: 'otheruser' });
      const otherUserRecipe = createMockRecipe({ user: otherUser });

      jest.spyOn(favoriteRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(recipeRepository, 'findOne')
        .mockResolvedValue(otherUserRecipe);

      await expect(service.addFavorite('user123', 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should not send notification if user has no token', async () => {
      const userWithoutToken = createMockUser({ notification_token: null });
      const recipeWithUserWithoutToken = createMockRecipe({
        user: userWithoutToken,
      });

      jest.spyOn(favoriteRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(recipeRepository, 'findOne')
        .mockResolvedValue(recipeWithUserWithoutToken);
      jest.spyOn(favoriteRepository, 'create').mockReturnValue(mockFavorite);
      jest.spyOn(favoriteRepository, 'save').mockResolvedValue(mockFavorite);

      const result = await service.addFavorite('user123', 1);

      expect(result).toEqual(mockFavorite);
      expect(notificationService.sendPushNotification).not.toHaveBeenCalled();
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite successfully', async () => {
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(mockRecipe);
      jest.spyOn(favoriteRepository, 'findOne').mockResolvedValue(mockFavorite);
      jest.spyOn(favoriteRepository, 'remove').mockResolvedValue(mockFavorite);

      await service.removeFavorite('user123', 1);

      expect(recipeRepository.findOne).toHaveBeenCalledWith({
        where: { id_recipe: 1 },
        relations: ['user'],
      });
      expect(favoriteRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id_user: 'user123' }, recipe: { id_recipe: 1 } },
      });
      expect(favoriteRepository.remove).toHaveBeenCalledWith(mockFavorite);
    });

    it('should throw NotFoundException if recipe does not exist', async () => {
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(null);

      await expect(service.removeFavorite('user123', 999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if recipe does not belong to user', async () => {
      const otherUser = createMockUser({ id_user: 'otheruser' });
      const otherUserRecipe = createMockRecipe({ user: otherUser });

      jest
        .spyOn(recipeRepository, 'findOne')
        .mockResolvedValue(otherUserRecipe);

      await expect(service.removeFavorite('user123', 1)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if favorite does not exist', async () => {
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(mockRecipe);
      jest.spyOn(favoriteRepository, 'findOne').mockResolvedValue(null);

      await expect(service.removeFavorite('user123', 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getFavorites', () => {
    it('should return list of favorite recipe IDs', async () => {
      const mockFavorites = [
        createMockFavorite({ recipe: createMockRecipe({ id_recipe: 1 }) }),
        createMockFavorite({ recipe: createMockRecipe({ id_recipe: 2 }) }),
      ];

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(favoriteRepository, 'find').mockResolvedValue(mockFavorites);

      const result = await service.getFavorites('user123');

      expect(result).toEqual([1, 2]);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id_user: 'user123' },
      });
      expect(favoriteRepository.find).toHaveBeenCalledWith({
        where: { user: { id_user: 'user123' } },
        relations: ['recipe'],
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getFavorites('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return empty array if user has no favorites', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(favoriteRepository, 'find').mockResolvedValue([]);

      const result = await service.getFavorites('user123');

      expect(result).toEqual([]);
    });
  });
});
