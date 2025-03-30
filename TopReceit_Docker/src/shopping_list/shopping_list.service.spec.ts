import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingListService } from './shopping_list.service';
import { ShoppingList } from './shopping_list.entity';
import { ShoppingListItem } from './shopping_list_item.entity';
import { User } from '../users/users.entity';
import { Recipe } from '../recipe/recipe.entity';
import { NotFoundException } from '@nestjs/common';

describe('ShoppingListService', () => {
  let service: ShoppingListService;
  let shoppingListRepository: Repository<ShoppingList>;
  let shoppingListItemRepository: Repository<ShoppingListItem>;
  let userRepository: Repository<User>;
  let recipeRepository: Repository<Recipe>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoppingListService,
        {
          provide: getRepositoryToken(ShoppingList),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ShoppingListItem),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Recipe),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ShoppingListService>(ShoppingListService);
    shoppingListRepository = module.get<Repository<ShoppingList>>(
      getRepositoryToken(ShoppingList),
    );
    shoppingListItemRepository = module.get<Repository<ShoppingListItem>>(
      getRepositoryToken(ShoppingListItem),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    recipeRepository = module.get<Repository<Recipe>>(
      getRepositoryToken(Recipe),
    );
  });

  describe('getShoppingList', () => {
    it('should return shopping list when found (success case)', async () => {
      const mockShoppingList = new ShoppingList();
      mockShoppingList.id = 'list-id';
      mockShoppingList.items = [];

      jest
        .spyOn(shoppingListRepository, 'findOne')
        .mockResolvedValue(mockShoppingList);

      const result = await service.getShoppingList('user-id');
      expect(result).toEqual(mockShoppingList);
      expect(shoppingListRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id_user: 'user-id' } },
        relations: ['items'],
      });
    });

    it('should throw NotFoundException when shopping list not found (error case)', async () => {
      jest.spyOn(shoppingListRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getShoppingList('user-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addRecipeIngredientsToShoppingList', () => {
    it('should add recipe ingredients to existing shopping list (success case)', async () => {
      const mockUser = new User();
      mockUser.id_user = 'user-id';

      const mockRecipe = {
        id_recipe: 1,
        recipeIngredients: [
          {
            quantity: 2,
            unit: 'kg',
            ingredient: { name: 'Flour' },
          },
        ],
      };

      const existingShoppingList = new ShoppingList();
      existingShoppingList.id = 'list-id';
      existingShoppingList.items = [];

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(recipeRepository, 'findOne')
        .mockResolvedValue(mockRecipe as any);
      jest
        .spyOn(shoppingListRepository, 'findOne')
        .mockResolvedValue(existingShoppingList);
      jest
        .spyOn(shoppingListRepository, 'save')
        .mockImplementation(async (list) => list as ShoppingList);

      const result = await service.addRecipeIngredientsToShoppingList(
        'user-id',
        1,
      );

      expect(result.items).toHaveLength(1);
      expect(result.items[0].ingredientName).toBe('Flour');
      expect(result.items[0].quantity).toBe(2);
      expect(result.items[0].unit).toBe('kg');
      expect(result.items[0].isPurchased).toBe(false);
    });

    it('should create new shopping list if none exists (success case)', async () => {
      const mockUser = new User();
      mockUser.id_user = 'user-id';

      const mockRecipe = {
        id_recipe: 1,
        recipeIngredients: [
          {
            quantity: 2,
            unit: 'kg',
            ingredient: { name: 'Flour' },
          },
        ],
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
      jest
        .spyOn(recipeRepository, 'findOne')
        .mockResolvedValue(mockRecipe as any);
      jest.spyOn(shoppingListRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(shoppingListRepository, 'save')
        .mockImplementation(async (list) => {
          list.id = 'new-list-id';
          return list as ShoppingList;
        });

      const result = await service.addRecipeIngredientsToShoppingList(
        'user-id',
        1,
      );

      expect(result.id).toBe('new-list-id');
      expect(result.items).toHaveLength(1);
    });

    it('should throw NotFoundException when user not found (error case)', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.addRecipeIngredientsToShoppingList('user-id', 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when recipe not found (error case)', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as User);
      jest.spyOn(recipeRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.addRecipeIngredientsToShoppingList('user-id', 1),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('clearShoppingList', () => {
    it('debería vaciar los items de la lista de compras (caso éxito)', async () => {
      // 1. Preparación - creamos mock data
      const mockItems = [
        { id: 'item-1', ingredientName: 'Flour' } as ShoppingListItem,
        { id: 'item-2', ingredientName: 'Sugar' } as ShoppingListItem,
      ];

      const mockShoppingList = new ShoppingList();
      mockShoppingList.id = 'list-id';
      mockShoppingList.items = [...mockItems]; // Copia de los items

      // 2. Configuramos los mocks
      jest
        .spyOn(shoppingListRepository, 'findOne')
        .mockResolvedValue(mockShoppingList);
      jest
        .spyOn(shoppingListItemRepository, 'remove')
        .mockResolvedValue(undefined);
      jest
        .spyOn(shoppingListRepository, 'save')
        .mockImplementation(async (list) => list as ShoppingList);

      // 3. Ejecutamos el método a testear
      await service.clearShoppingList('user-id');

      // 4. Verificaciones
      // Debería llamar a remove con los items existentes
      expect(shoppingListItemRepository.remove).toHaveBeenCalledWith(mockItems);

      // Debería guardar la lista con items vacíos
      expect(shoppingListRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'list-id',
          items: [],
        }),
      );

      // Verificamos que se llamó a findOne
      expect(shoppingListRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id_user: 'user-id' } },
        relations: ['items'],
      });
    });

    it('debería lanzar NotFoundException cuando la lista no existe (caso error)', async () => {
      // Corrección: Usar findOne con mayúscula y tipado correcto
      jest
        .spyOn(shoppingListRepository, 'findOne')
        .mockResolvedValue(null as unknown as ShoppingList);

      await expect(service.clearShoppingList('user-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeShoppingListItem', () => {
    it('should remove item from shopping list (success case)', async () => {
      const mockItem = {
        id: 'item-id',
        ingredientName: 'Flour',
      } as ShoppingListItem;
      const mockShoppingList = new ShoppingList();
      mockShoppingList.id = 'list-id';
      mockShoppingList.items = [mockItem];

      jest
        .spyOn(shoppingListRepository, 'findOne')
        .mockResolvedValue(mockShoppingList);
      jest
        .spyOn(shoppingListRepository, 'save')
        .mockImplementation(async (list) => list as ShoppingList);
      jest.spyOn(shoppingListItemRepository, 'remove').mockResolvedValue(null);

      await service.removeShoppingListItem('user-id', 'item-id');

      expect(shoppingListRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ items: [] }),
      );
      expect(shoppingListItemRepository.remove).toHaveBeenCalledWith(mockItem);
    });

    it('should throw NotFoundException when shopping list not found (error case)', async () => {
      jest.spyOn(shoppingListRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.removeShoppingListItem('user-id', 'item-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when item not found in list (error case)', async () => {
      const mockShoppingList = new ShoppingList();
      mockShoppingList.id = 'list-id';
      mockShoppingList.items = [];

      jest
        .spyOn(shoppingListRepository, 'findOne')
        .mockResolvedValue(mockShoppingList);

      await expect(
        service.removeShoppingListItem('user-id', 'item-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('toggleItemPurchased', () => {
    it('should toggle item purchased status (success case)', async () => {
      const mockItem = {
        id: 'item-id',
        ingredientName: 'Flour',
        isPurchased: false,
      } as ShoppingListItem;
      const mockShoppingList = new ShoppingList();
      mockShoppingList.id = 'list-id';
      mockShoppingList.items = [mockItem];

      jest
        .spyOn(shoppingListRepository, 'findOne')
        .mockResolvedValue(mockShoppingList);
      jest
        .spyOn(shoppingListItemRepository, 'save')
        .mockImplementation(async (item) => item as ShoppingListItem);

      const result = await service.toggleItemPurchased('user-id', 'item-id');

      expect(result.isPurchased).toBe(true);
      expect(shoppingListItemRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ isPurchased: true }),
      );
    });

    it('should throw NotFoundException when shopping list not found (error case)', async () => {
      jest.spyOn(shoppingListRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.toggleItemPurchased('user-id', 'item-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when item not found in list (error case)', async () => {
      const mockShoppingList = new ShoppingList();
      mockShoppingList.id = 'list-id';
      mockShoppingList.items = [];

      jest
        .spyOn(shoppingListRepository, 'findOne')
        .mockResolvedValue(mockShoppingList);

      await expect(
        service.toggleItemPurchased('user-id', 'item-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
