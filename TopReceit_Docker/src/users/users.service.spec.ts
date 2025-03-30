import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './users.service';
import { User } from './users.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  // Mock de datos para reutilizar en los tests
  const mockUser: User = {
    id_user: 'user123',
    email: 'test@example.com',
    username: 'testuser',
    role: 2,
    preferences: ['italiana', 'vegetariana'],
    avatar: 'avatar.jpg',
    tokenExpiration: null,
    token: null,
    notification_token: null,
    recipes: [],
    favorites: [],
    likes: [],
    following: [],
    followers: [],
    shoppingLists: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            merge: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
          },
        },
        // Eliminamos la dependencia de NotificationService
        // Simplemente no la proveemos en los tests
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  // ----------------------------
  // TEST PARA createUser
  // ----------------------------
  describe('createUser', () => {
    it('debería crear un usuario exitosamente', async () => {
      const createUserDto: CreateUserDto = {
        id_user: 'user123',
        email: 'test@example.com',
        username: 'testuser',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [{ username: 'testuser' }, { email: 'test@example.com' }],
      });
    });

    it('debería lanzar ConflictException si el usuario ya existe', async () => {
      const createUserDto: CreateUserDto = {
        id_user: 'user123',
        email: 'test@example.com',
        username: 'testuser',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('debería lanzar error si faltan campos obligatorios', async () => {
      const createUserDto = {} as CreateUserDto;

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ... (resto de los tests se mantienen igual)
  // ----------------------------
  // TEST PARA getUserById
  // ----------------------------
  describe('getUserById', () => {
    it('debería retornar un usuario si existe', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const result = await service.getUserById('user123');
      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id_user: 'user123' },
        relations: ['favorites', 'favorites.recipe', 'following', 'followers'],
      });
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getUserById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ----------------------------
  // TEST PARA updateUser
  // ----------------------------
  describe('updateUser', () => {
    it('debería actualizar un usuario exitosamente', async () => {
      const updateUserDto: UpdateUserDto = {
        id_user: 'user123',
        username: 'updatedUser',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...mockUser,
        ...updateUserDto,
      });

      const result = await service.updateUser(updateUserDto);
      expect(result.username).toBe('updatedUser');
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      const updateUserDto: UpdateUserDto = {
        id_user: 'invalid-id',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.updateUser(updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ----------------------------
  // TEST PARA removeUser
  // ----------------------------
  describe('removeUser', () => {
    it('debería eliminar un usuario existente', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(undefined);

      await service.removeUser('user123');
      expect(userRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('debería lanzar error si el usuario no existe', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.removeUser('invalid-id')).rejects.toThrow(
        'User not found',
      );
    });
  });

  // ----------------------------
  // TEST PARA getUserProfile
  // ----------------------------
  describe('getUserProfile', () => {
    it('debería retornar el perfil con recetas públicas', async () => {
      const mockUserWithRecipes = {
        ...mockUser,
        recipes: [
          {
            id_recipe: '1',
            isPublic: true,
            user: null,
            title: 'Recipe 1',
            description: 'Description 1',
            image: 'image1.jpg',
            ingredients: [],
            steps: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id_recipe: '2',
            isPublic: false,
            user: null,
            title: 'Recipe 2',
            description: 'Description 2',
            image: 'image2.jpg',
            ingredients: [],
            steps: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            recipeIngredients: [],
            favorites: [],
            likes: [],
          },
        ],
      };

      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(mockUserWithRecipes as any);

      const result = await service.getUserProfile('user123');
      expect(result.publishedRecipes.length).toBe(1);
      expect(result.publishedRecipes[0].id_recipe).toBe('1');
    });
  });

  // ----------------------------
  // TEST PARA updateNotificationToken
  // ----------------------------
  describe('updateNotificationToken', () => {
    it('debería actualizar el token de notificación', async () => {
      const newToken = 'new-token-123';
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...mockUser,
        notification_token: newToken,
      });

      const result = await service.updateNotificationToken('user123', newToken);
      expect(result.notification_token).toBe(newToken);
    });
  });
});
