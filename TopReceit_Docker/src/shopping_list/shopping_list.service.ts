import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingList } from './shopping_list.entity';
import { ShoppingListItem } from './shopping_list_item.entity';
import { User } from '../users/users.entity';
import { Recipe } from '../recipe/recipe.entity';

@Injectable()
export class ShoppingListService {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListRepository: Repository<ShoppingList>,
    @InjectRepository(ShoppingListItem)
    private readonly shoppingListItemRepository: Repository<ShoppingListItem>, // Inyectar el repositorio de ShoppingListItem
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  async getShoppingList(userId: string): Promise<ShoppingList> {
    // Buscar la lista de la compra activa para el usuario
    const shoppingList = await this.shoppingListRepository.findOne({
      where: { user: { id_user: userId } },
      relations: ['items'], // Cargar los ítems de la lista
    });

    if (!shoppingList) {
      throw new NotFoundException(
        'No se encontró una lista de la compra activa',
      );
    }

    return shoppingList;
  }

  /**
   * Añade los ingredientes de una receta a la lista de la compra del usuario.
   * Si no existe una lista activa, crea una nueva.
   */
  async addRecipeIngredientsToShoppingList(
    userId: string,
    recipeId: number,
  ): Promise<ShoppingList> {
    // Obtener el usuario
    const user = await this.userRepository.findOne({
      where: { id_user: userId },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Obtener la receta con sus ingredientes
    const recipe = await this.recipeRepository.findOne({
      where: { id_recipe: recipeId },
      relations: ['recipeIngredients', 'recipeIngredients.ingredient'],
    });
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }

    // Buscar una lista de la compra activa para el usuario
    let shoppingList = await this.shoppingListRepository.findOne({
      where: { user: { id_user: userId } },
      relations: ['items'], // Cargar los ítems existentes
    });

    // Si no existe una lista activa, crear una nueva
    if (!shoppingList) {
      shoppingList = new ShoppingList();
      shoppingList.user = user;
      shoppingList.items = []; // Inicializar la lista de ítems vacía
    }

    // Transformar los RecipeIngredient en ShoppingListItem y agregarlos a la lista
    const newItems = recipe.recipeIngredients.map((ri) => {
      const item = new ShoppingListItem();
      item.ingredientName = ri.ingredient.name; // Nombre del ingrediente
      item.quantity = ri.quantity; // Cantidad del ingrediente
      item.unit = ri.unit; // Unidad de medida
      item.isPurchased = false; // Por defecto, no comprado
      return item;
    });

    // Agregar los nuevos ítems a la lista existente
    shoppingList.items = [...shoppingList.items, ...newItems];

    // Guardar la lista de la compra actualizada
    return this.shoppingListRepository.save(shoppingList);
  }

  /**
   * Vacía completamente la lista de la compra del usuario.
   */
  async clearShoppingList(userId: string): Promise<void> {
    // Buscar la lista de la compra activa para el usuario
    const shoppingList = await this.shoppingListRepository.findOne({
      where: { user: { id_user: userId } },
      relations: ['items'], // Cargar los ítems de la lista
    });

    if (!shoppingList) {
      throw new NotFoundException(
        'No se encontró una lista de la compra activa',
      );
    }

    // Eliminar todos los ítems de la base de datos
    await this.shoppingListItemRepository.remove(shoppingList.items);

    // Vaciar la lista de ítems en memoria
    shoppingList.items = [];

    // Guardar la lista actualizada
    await this.shoppingListRepository.save(shoppingList);
  }

  /**
   * Elimina un ítem específico de la lista de la compra del usuario.
   */
  async removeShoppingListItem(userId: string, itemId: string): Promise<void> {
    // Buscar la lista de la compra activa para el usuario
    const shoppingList = await this.shoppingListRepository.findOne({
      where: { user: { id_user: userId } },
      relations: ['items'], // Cargar los ítems de la lista
    });

    if (!shoppingList) {
      throw new NotFoundException(
        'No se encontró una lista de la compra activa',
      );
    }

    // Buscar el ítem en la lista
    const itemIndex = shoppingList.items.findIndex(
      (item) => item.id === itemId,
    );
    if (itemIndex === -1) {
      throw new NotFoundException(
        'Ítem no encontrado en la lista de la compra',
      );
    }

    // Obtener el ítem específico
    const itemToRemove = shoppingList.items[itemIndex];

    // Eliminar el ítem de la lista en memoria
    shoppingList.items.splice(itemIndex, 1);

    // Guardar la lista actualizada (sin el ítem)
    await this.shoppingListRepository.save(shoppingList);

    // Eliminar el ítem de la base de datos
    await this.shoppingListItemRepository.remove(itemToRemove);
  }

  /**
   * Invierte el valor de isPurchased (toggle).
   */
  async toggleItemPurchased(
    userId: string,
    itemId: string,
  ): Promise<ShoppingListItem> {
    // Buscar la lista de la compra activa para el usuario
    const shoppingList = await this.shoppingListRepository.findOne({
      where: { user: { id_user: userId } },
      relations: ['items'], // Cargar los ítems de la lista
    });

    if (!shoppingList) {
      throw new NotFoundException(
        'No se encontró una lista de la compra activa',
      );
    }

    // Buscar el ítem en la lista
    const item = shoppingList.items.find((item) => item.id === itemId);
    if (!item) {
      throw new NotFoundException(
        'Ítem no encontrado en la lista de la compra',
      );
    }

    // Invertir el valor de isPurchased
    item.isPurchased = !item.isPurchased;

    // Guardar el ítem actualizado en la base de datos
    await this.shoppingListItemRepository.save(item);

    return item;
  }
}
