import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ShoppingList } from './shopping_list.entity';

@Entity('shopping_list_items')
export class ShoppingListItem {
  @PrimaryGeneratedColumn('uuid') // ID único generado automáticamente
  id: string;

  @Column({ type: 'varchar', length: 255 }) // Nombre del ingrediente
  ingredientName: string;

  @Column({ type: 'float', nullable: true }) // Cantidad del ingrediente
  quantity: number;

  @Column({ type: 'varchar', length: 50, nullable: true }) // Unidad de medida
  unit: string;

  @Column({ type: 'boolean', default: false }) // Indica si el ingrediente ha sido comprado
  isPurchased: boolean;

  @ManyToOne(() => ShoppingList, (shoppingList) => shoppingList.items, {
    onDelete: 'CASCADE', // Elimina el ítem si se elimina la lista
  })
  @JoinColumn({ name: 'shopping_list_id' }) // Columna de relación con la lista
  shoppingList: ShoppingList;
}
