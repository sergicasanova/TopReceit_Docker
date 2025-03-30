import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipeIngredientService } from './recipe_ingredient.service';
import { RecipeIngredient } from './recipe_ingredient.entity';
import { Recipe } from '../recipe/recipe.entity';
import { IngredientEntity } from '../ingredient/ingredient.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  CreateRecipeIngredientDto,
  UpdateRecipeIngredientDto,
} from './recipe_ingredient.dto';

describe('RecipeIngredientService', () => {
  let service: RecipeIngredientService;
  let recipeIngredientRepository: Repository<RecipeIngredient>;
  let recipeRepository: Repository<Recipe>;
  let ingredientRepository: Repository<IngredientEntity>;

  // Mock data
  const mockRecipe: Recipe = {
    id_recipe: 1,
    title: 'Test Recipe',
    // ... otras propiedades
  } as Recipe;

  const mockIngredient: IngredientEntity = {
    id_ingredient: 1,
    name: 'Test Ingredient',
    // ... otras propiedades
  } as IngredientEntity;

  const mockRecipeIngredient: RecipeIngredient = {
    id_recipe_ingredient: 1,
    quantity: 100,
    unit: 'gr',
    recipe: mockRecipe,
    ingredient: mockIngredient,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipeIngredientService,
        {
          provide: getRepositoryToken(RecipeIngredient),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Recipe),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(IngredientEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecipeIngredientService>(RecipeIngredientService);
    recipeIngredientRepository = module.get<Repository<RecipeIngredient>>(
      getRepositoryToken(RecipeIngredient),
    );
    recipeRepository = module.get<Repository<Recipe>>(
      getRepositoryToken(Recipe),
    );
    ingredientRepository = module.get<Repository<IngredientEntity>>(
      getRepositoryToken(IngredientEntity),
    );
  });

  describe('createRecipeIngredient', () => {
    it('debería crear un ingrediente de receta exitosamente', async () => {
      const createDto: CreateRecipeIngredientDto = {
        recipe_id: 1,
        ingredient_id: 1,
        quantity: 100,
        unit: 'gr',
      };

      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(mockRecipe);
      jest
        .spyOn(ingredientRepository, 'findOne')
        .mockResolvedValue(mockIngredient);
      jest
        .spyOn(recipeIngredientRepository, 'create')
        .mockReturnValue(mockRecipeIngredient);
      jest
        .spyOn(recipeIngredientRepository, 'save')
        .mockResolvedValue(mockRecipeIngredient);

      const result = await service.createRecipeIngredient(createDto);

      expect(result).toEqual(mockRecipeIngredient);
      expect(recipeRepository.findOne).toHaveBeenCalledWith({
        where: { id_recipe: 1 },
      });
      expect(ingredientRepository.findOne).toHaveBeenCalledWith({
        where: { id_ingredient: 1 },
      });
      expect(recipeIngredientRepository.create).toHaveBeenCalledWith({
        recipe: { id_recipe: 1 },
        ingredient: { id_ingredient: 1 },
        quantity: 100,
        unit: 'gr',
      });
    });

    it('debería lanzar BadRequestException si faltan IDs obligatorios', async () => {
      const invalidDto = {
        quantity: 100,
        unit: 'gr',
      } as CreateRecipeIngredientDto;

      await expect(service.createRecipeIngredient(invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('debería lanzar NotFoundException si la receta no existe', async () => {
      const createDto: CreateRecipeIngredientDto = {
        recipe_id: 999,
        ingredient_id: 1,
        quantity: 100,
        unit: 'gr',
      };

      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createRecipeIngredient(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debería lanzar NotFoundException si el ingrediente no existe', async () => {
      const createDto: CreateRecipeIngredientDto = {
        recipe_id: 1,
        ingredient_id: 999,
        quantity: 100,
        unit: 'gr',
      };

      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(mockRecipe);
      jest.spyOn(ingredientRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createRecipeIngredient(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllIngredientsForRecipe', () => {
    it('debería retornar todos los ingredientes de una receta', async () => {
      const mockIngredients = [mockRecipeIngredient];

      jest
        .spyOn(recipeIngredientRepository, 'find')
        .mockResolvedValue(mockIngredients);

      const result = await service.getAllIngredientsForRecipe(1);

      expect(result).toEqual(mockIngredients);
      expect(recipeIngredientRepository.find).toHaveBeenCalledWith({
        where: { recipe: { id_recipe: 1 } },
        relations: ['ingredient'],
      });
    });
  });

  describe('getIngredientById', () => {
    it('debería retornar un ingrediente de receta por ID', async () => {
      jest
        .spyOn(recipeIngredientRepository, 'findOne')
        .mockResolvedValue(mockRecipeIngredient);

      const result = await service.getIngredientById(1);

      expect(result).toEqual(mockRecipeIngredient);
      expect(recipeIngredientRepository.findOne).toHaveBeenCalledWith({
        where: { id_recipe_ingredient: 1 },
        relations: ['ingredient'],
      });
    });

    it('debería lanzar NotFoundException si el ingrediente no existe', async () => {
      jest.spyOn(recipeIngredientRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getIngredientById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateRecipeIngredient', () => {
    it('debería actualizar un ingrediente de receta', async () => {
      const updateDto: UpdateRecipeIngredientDto = {
        quantity: 200,
        unit: 'ml',
      };

      jest
        .spyOn(recipeIngredientRepository, 'findOne')
        .mockResolvedValue(mockRecipeIngredient);
      jest.spyOn(recipeIngredientRepository, 'save').mockResolvedValue({
        ...mockRecipeIngredient,
        ...updateDto,
      });

      const result = await service.updateRecipeIngredient(1, updateDto);

      expect(result.quantity).toBe(200);
      expect(result.unit).toBe('ml');
    });

    it('debería actualizar el ingrediente si se proporciona ingredient_id', async () => {
      const updateDto: UpdateRecipeIngredientDto = {
        ingredient_id: 2,
      };

      const updatedIngredient = { ...mockIngredient, id_ingredient: 2 };
      jest
        .spyOn(recipeIngredientRepository, 'findOne')
        .mockResolvedValue(mockRecipeIngredient);
      jest
        .spyOn(ingredientRepository, 'findOne')
        .mockResolvedValue(updatedIngredient);
      jest.spyOn(recipeIngredientRepository, 'save').mockResolvedValue({
        ...mockRecipeIngredient,
        ingredient: updatedIngredient,
      });

      const result = await service.updateRecipeIngredient(1, updateDto);

      expect(result.ingredient.id_ingredient).toBe(2);
    });

    it('debería lanzar NotFoundException si el ingrediente de receta no existe', async () => {
      const updateDto: UpdateRecipeIngredientDto = {
        quantity: 200,
      };

      jest.spyOn(recipeIngredientRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateRecipeIngredient(999, updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteRecipeIngredient', () => {
    it('debería eliminar un ingrediente de receta', async () => {
      jest
        .spyOn(recipeIngredientRepository, 'findOne')
        .mockResolvedValue(mockRecipeIngredient);
      jest.spyOn(recipeIngredientRepository, 'remove').mockResolvedValue(null);

      await service.deleteRecipeIngredient(1);

      expect(recipeIngredientRepository.findOne).toHaveBeenCalledWith({
        where: { id_recipe_ingredient: 1 },
        relations: ['recipe', 'ingredient'],
      });
      expect(recipeIngredientRepository.remove).toHaveBeenCalledWith(
        mockRecipeIngredient,
      );
    });

    it('debería lanzar NotFoundException si el ingrediente no existe', async () => {
      jest.spyOn(recipeIngredientRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteRecipeIngredient(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
