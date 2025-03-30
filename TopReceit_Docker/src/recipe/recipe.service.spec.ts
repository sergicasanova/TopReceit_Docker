import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Like as TypeOrmLike, In } from 'typeorm';
import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.entity';
import { User } from '../users/users.entity';
import { Follow } from '../follow/follow.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto, UpdateRecipeDto } from './recipe.dto';

describe('RecipeService', () => {
  let service: RecipeService;
  let recipeRepository: Repository<Recipe>;
  let userRepository: Repository<User>;
  let followRepository: Repository<Follow>;

  // Mock data
  const mockUser: User = {
    id_user: 'user123',
    username: 'testuser',
  } as User;

  const mockRecipe: Recipe = {
    id_recipe: 1,
    title: 'Test Recipe',
    description: 'Test Description',
    isPublic: true,
    user: mockUser,
  } as Recipe;

  const mockFollow: Follow = {
    id: '1',
    follower: mockUser,
    followed: { ...mockUser, id_user: 'user456' },
  };

  // Mock completo para QueryBuilder
  const createQueryBuilderMock = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([mockRecipe]),
    // Añadir más métodos según sea necesario
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeService,
        {
          provide: getRepositoryToken(Recipe),
          useValue: {
            create: jest
              .fn()
              .mockImplementation((dto) => ({ ...dto, id_recipe: 1 })),
            save: jest
              .fn()
              .mockImplementation((recipe) => Promise.resolve(recipe)),
            find: jest.fn().mockResolvedValue([mockRecipe]),
            findOne: jest.fn().mockResolvedValue(mockRecipe),
            remove: jest.fn().mockResolvedValue(null),
            createQueryBuilder: jest.fn(() => createQueryBuilderMock),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: getRepositoryToken(Follow),
          useValue: {
            find: jest.fn().mockResolvedValue([mockFollow]),
          },
        },
      ],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
    recipeRepository = module.get<Repository<Recipe>>(
      getRepositoryToken(Recipe),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    followRepository = module.get<Repository<Follow>>(
      getRepositoryToken(Follow),
    );
  });

  describe('createRecipe', () => {
    it('debería crear una receta exitosamente', async () => {
      const createDto: CreateRecipeDto = {
        title: 'Test Recipe',
        description: 'Test Description',
        user_id: 'user123',
        image: 'test.jpg',
      };

      const result = await service.createRecipe(createDto);

      expect(result).toEqual(
        expect.objectContaining({
          title: 'Test Recipe',
          description: 'Test Description',
          image: 'test.jpg',
          user: { id_user: 'user123' },
        }),
      );
      expect(recipeRepository.create).toHaveBeenCalledWith({
        title: 'Test Recipe',
        description: 'Test Description',
        image: 'test.jpg',
        user: { id_user: 'user123' },
      });
    });

    it('debería lanzar BadRequestException si falta el user_id', async () => {
      const invalidDto = { title: 'Test' } as CreateRecipeDto;

      await expect(service.createRecipe(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería lanzar BadRequestException si el título está vacío', async () => {
      const invalidDto: CreateRecipeDto = {
        title: '',
        user_id: 'user123',
        description: '',
        image: '',
      };

      await expect(service.createRecipe(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('updateRecipe', () => {
    it('debería actualizar una receta exitosamente', async () => {
      const updateDto: UpdateRecipeDto = {
        id_recipe: '1',
        title: 'Updated Recipe',
        description: 'Updated Description',
      };

      const result = await service.updateRecipe(1, updateDto);

      expect(result).toEqual(
        expect.objectContaining({
          title: 'Updated Recipe',
          description: 'Updated Description',
        }),
      );
    });

    it('debería lanzar NotFoundException si la receta no existe', async () => {
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.updateRecipe(999, {
          id_recipe: '999',
          title: 'Test',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllRecipes', () => {
    it('debería retornar todas las recetas', async () => {
      const result = await service.getAllRecipes();

      expect(result).toEqual([mockRecipe]);
      expect(recipeRepository.find).toHaveBeenCalledWith({
        relations: ['recipeIngredients', 'steps', 'user', 'likes.user'],
      });
    });
  });

  describe('getPublicRecipes', () => {
    it('debería retornar solo recetas públicas', async () => {
      const result = await service.getPublicRecipes();

      expect(result).toEqual([mockRecipe]);
      expect(recipeRepository.find).toHaveBeenCalledWith({
        where: { isPublic: true },
        relations: ['recipeIngredients', 'steps', 'user', 'likes.user'],
      });
    });
  });

  describe('getUserPublicRecipes', () => {
    it('debería retornar recetas públicas de un usuario', async () => {
      const result = await service.getUserPublicRecipes('user123');

      expect(result).toEqual([mockRecipe]);
      expect(recipeRepository.find).toHaveBeenCalledWith({
        where: {
          isPublic: true,
          user: { id_user: 'user123' },
        },
        relations: ['recipeIngredients', 'steps', 'user', 'likes.user'],
      });
    });
  });

  describe('searchRecipesByTitle', () => {
    it('debería buscar recetas por título', async () => {
      const result = await service.searchRecipesByTitle('Test');

      expect(result).toEqual([mockRecipe]);
      expect(recipeRepository.find).toHaveBeenCalledWith({
        where: {
          title: TypeOrmLike('%Test%'),
        },
      });
    });
  });

  describe('getRecipesByUserId', () => {
    it('debería retornar recetas de un usuario', async () => {
      const result = await service.getRecipesByUserId('user123');

      expect(result).toEqual([mockRecipe]);
      expect(recipeRepository.find).toHaveBeenCalledWith({
        where: { user: { id_user: 'user123' } },
        relations: ['recipeIngredients', 'steps', 'user'],
      });
    });

    it('debería lanzar NotFoundException si el usuario no existe', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.getRecipesByUserId('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getRecipeById', () => {
    it('debería retornar una receta por ID', async () => {
      const result = await service.getRecipeById(1);

      expect(result).toEqual(mockRecipe);
      expect(recipeRepository.findOne).toHaveBeenCalledWith({
        where: { id_recipe: 1 },
        relations: ['steps', 'recipeIngredients'],
      });
    });

    it('debería lanzar NotFoundException si la receta no existe', async () => {
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.getRecipeById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteRecipe', () => {
    it('debería eliminar una receta', async () => {
      await service.deleteRecipe(1);

      expect(recipeRepository.findOne).toHaveBeenCalledWith({
        where: { id_recipe: 1 },
      });
      expect(recipeRepository.remove).toHaveBeenCalledWith(mockRecipe);
    });

    it('debería lanzar NotFoundException si la receta no existe', async () => {
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.deleteRecipe(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getFilteredPublicRecipes', () => {
    it('debería filtrar recetas públicas', async () => {
      const result = await service.getFilteredPublicRecipes('Test', 5, 10, [
        'user123',
      ]);

      expect(result).toEqual([mockRecipe]);
      expect(createQueryBuilderMock.where).toHaveBeenCalledWith(
        'recipe.isPublic = :isPublic',
        { isPublic: true },
      );
      expect(createQueryBuilderMock.andWhere).toHaveBeenCalledWith(
        'recipe.title LIKE :title',
        { title: '%Test%' },
      );
    });
  });

  describe('getPublicRecipesByFollowing', () => {
    it('debería retornar recetas públicas de usuarios seguidos', async () => {
      const result = await service.getPublicRecipesByFollowing('user123');

      expect(result).toEqual([mockRecipe]);
      expect(followRepository.find).toHaveBeenCalledWith({
        where: { follower: { id_user: 'user123' } },
        relations: ['followed'],
      });
      expect(recipeRepository.find).toHaveBeenCalledWith({
        where: {
          isPublic: true,
          user: { id_user: In(['user456']) },
        },
        relations: ['user'],
      });
    });

    it('debería retornar array vacío si no sigue a nadie', async () => {
      jest.spyOn(followRepository, 'find').mockResolvedValueOnce([]);

      const result = await service.getPublicRecipesByFollowing('user123');

      expect(result).toEqual([]);
    });
  });
});
