import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngredientService } from './ingredient.service';
import { IngredientEntity } from './ingredient.entity';
import { IngredientDto } from './ingredient.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('IngredientService', () => {
  let service: IngredientService;
  let ingredientRepository: Repository<IngredientEntity>;

  // Mock data
  const mockIngredient: IngredientEntity = {
    id_ingredient: 1,
    name: 'Tomate',
    recipeIngredients: [],
  };

  const mockIngredientDto: IngredientDto = {
    name: 'Tomate',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientService,
        {
          provide: getRepositoryToken(IngredientEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IngredientService>(IngredientService);
    ingredientRepository = module.get<Repository<IngredientEntity>>(
      getRepositoryToken(IngredientEntity),
    );
  });

  describe('getAllIngredients', () => {
    it('should return all ingredients', async () => {
      const mockIngredients = [mockIngredient, mockIngredient];
      jest
        .spyOn(ingredientRepository, 'find')
        .mockResolvedValue(mockIngredients);

      const result = await service.getAllIngredients();

      expect(result).toEqual(mockIngredients);
      expect(ingredientRepository.find).toHaveBeenCalled();
    });

    it('should return empty array if no ingredients exist', async () => {
      jest.spyOn(ingredientRepository, 'find').mockResolvedValue([]);

      const result = await service.getAllIngredients();

      expect(result).toEqual([]);
    });
  });

  describe('getIngredientsByName', () => {
    it('should return ingredients matching name pattern', async () => {
      const mockIngredients = [mockIngredient];
      jest
        .spyOn(ingredientRepository, 'find')
        .mockResolvedValue(mockIngredients);

      const result = await service.getIngredientsByName('tom');

      expect(result).toEqual(mockIngredients);
      expect(ingredientRepository.find).toHaveBeenCalledWith({
        where: { name: expect.anything() }, // Puedes hacerlo más específico si es necesario
      });
    });

    it('should return empty array if no matches found', async () => {
      jest.spyOn(ingredientRepository, 'find').mockResolvedValue([]);

      const result = await service.getIngredientsByName('nonexistent');

      expect(result).toEqual([]);
    });
  });

  describe('createIngredient', () => {
    it('should create a new ingredient successfully', async () => {
      jest.spyOn(ingredientRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(ingredientRepository, 'create')
        .mockReturnValue(mockIngredient);
      jest
        .spyOn(ingredientRepository, 'save')
        .mockResolvedValue(mockIngredient);

      const result = await service.createIngredient(mockIngredientDto);

      expect(result).toEqual(mockIngredient);
      expect(ingredientRepository.findOne).toHaveBeenCalledWith({
        where: { name: 'tomate' }, // Verifica la normalización
      });
      expect(ingredientRepository.create).toHaveBeenCalledWith(
        mockIngredientDto,
      );
    });

    it('should throw BadRequestException if ingredient already exists', async () => {
      jest
        .spyOn(ingredientRepository, 'findOne')
        .mockResolvedValue(mockIngredient);

      await expect(service.createIngredient(mockIngredientDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle database errors during creation', async () => {
      jest.spyOn(ingredientRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(ingredientRepository, 'create')
        .mockReturnValue(mockIngredient);
      jest
        .spyOn(ingredientRepository, 'save')
        .mockRejectedValue(new Error('DB Error'));

      await expect(service.createIngredient(mockIngredientDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteIngredient', () => {
    it('should delete an ingredient successfully', async () => {
      jest
        .spyOn(ingredientRepository, 'findOne')
        .mockResolvedValue(mockIngredient);
      jest
        .spyOn(ingredientRepository, 'remove')
        .mockResolvedValue(mockIngredient);

      await service.deleteIngredient(1);

      expect(ingredientRepository.findOne).toHaveBeenCalledWith({
        where: { id_ingredient: 1 },
      });
      expect(ingredientRepository.remove).toHaveBeenCalledWith(mockIngredient);
    });

    it('should throw NotFoundException if ingredient does not exist', async () => {
      jest.spyOn(ingredientRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteIngredient(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
