import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StepsService } from './steps.service';
import { Steps } from './steps.entity';
import { Recipe } from '../recipe/recipe.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('StepsService', () => {
  let service: StepsService;
  let stepsRepository: Repository<Steps>;
  let recipeRepository: Repository<Recipe>;

  // Mock data
  const mockRecipe: Recipe = {
    id_recipe: 1,
    title: 'Receta de prueba',
    // ... otras propiedades mínimas requeridas
  } as Recipe;

  const mockStep: Steps = {
    id_steps: 1,
    description: 'Cortar los ingredientes',
    order: 1,
    recipe: mockRecipe,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StepsService,
        {
          provide: getRepositoryToken(Steps),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Recipe),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StepsService>(StepsService);
    stepsRepository = module.get<Repository<Steps>>(getRepositoryToken(Steps));
    recipeRepository = module.get<Repository<Recipe>>(
      getRepositoryToken(Recipe),
    );
  });

  describe('createStep', () => {
    it('debería crear un paso exitosamente', async () => {
      // Mockeamos las respuestas
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(mockRecipe);
      jest.spyOn(stepsRepository, 'create').mockReturnValue(mockStep);
      jest.spyOn(stepsRepository, 'save').mockResolvedValue(mockStep);

      const result = await service.createStep(1, {
        description: 'Cortar los ingredientes',
        order: 1,
      });

      expect(result).toEqual(mockStep);
      expect(recipeRepository.findOne).toHaveBeenCalledWith({
        where: { id_recipe: 1 },
      });
      expect(stepsRepository.create).toHaveBeenCalledWith({
        description: 'Cortar los ingredientes',
        order: 1,
        recipe: { id_recipe: 1 },
      });
    });

    it('debería lanzar NotFoundException si la receta no existe', async () => {
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.createStep(999, {
          description: 'Paso inválido',
          order: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar BadRequestException si faltan datos obligatorios', async () => {
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(mockRecipe); // Mock de receta existente

      await expect(
        service.createStep(1, { description: '', order: 0 } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getStepsByRecipe', () => {
    it('debería retornar pasos ordenados por "order"', async () => {
      const mockSteps = [mockStep, { ...mockStep, id_steps: 2, order: 2 }];

      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(mockRecipe);
      jest.spyOn(stepsRepository, 'find').mockResolvedValue(mockSteps);

      const result = await service.getStepsByRecipe(1);
      expect(result).toEqual(mockSteps);
      expect(stepsRepository.find).toHaveBeenCalledWith({
        where: { recipe: { id_recipe: 1 } },
        order: { order: 'ASC' },
      });
    });

    it('debería lanzar NotFoundException si la receta no existe', async () => {
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getStepsByRecipe(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStep', () => {
    it('debería actualizar un paso existente', async () => {
      const updatedStep = {
        ...mockStep,
        description: 'Descripción actualizada',
      };

      jest.spyOn(stepsRepository, 'findOne').mockResolvedValue(mockStep);
      jest.spyOn(stepsRepository, 'save').mockResolvedValue(updatedStep);

      const result = await service.updateStep(1, {
        description: 'Descripción actualizada',
      });

      expect(result.description).toBe('Descripción actualizada');
      expect(stepsRepository.findOne).toHaveBeenCalledWith({
        where: { id_steps: 1 },
      });
    });

    it('debería lanzar NotFoundException si el paso no existe', async () => {
      jest.spyOn(stepsRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateStep(999, { description: 'Actualización' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteStep', () => {
    it('debería eliminar un paso existente', async () => {
      // 1. Configurar mocks
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(mockRecipe);
      jest.spyOn(stepsRepository, 'findOne').mockResolvedValue(mockStep);
      const deleteMock = jest
        .spyOn(stepsRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      // 2. Ejecutar
      await service.deleteStep(1, 1);

      // 3. Verificar
      expect(recipeRepository.findOne).toHaveBeenCalledWith({
        where: { id_recipe: 1 },
      });
      expect(stepsRepository.findOne).toHaveBeenCalledWith({
        where: {
          id_steps: 1,
          recipe: { id_recipe: 1 },
        },
      });
      expect(deleteMock).toHaveBeenCalledWith(mockStep);
    });

    it('debería lanzar NotFoundException si la receta no existe', async () => {
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteStep(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('debería lanzar NotFoundException si el paso no existe', async () => {
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(mockRecipe);
      jest.spyOn(stepsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteStep(999, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteStepid', () => {
    it('debería eliminar un paso por ID', async () => {
      const deleteMock = jest
        .spyOn(stepsRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      await service.deleteStepid(1);
      expect(deleteMock).toHaveBeenCalledWith({ id_steps: 1 }); // Ajustado al parámetro real
    });

    it('debería lanzar NotFoundException si el paso no existe', async () => {
      jest
        .spyOn(stepsRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.deleteStepid(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
