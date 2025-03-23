import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/users.entity';
import { ShoppingListItem } from './shopping_list_item.entity';

@Entity('shopping_lists')
export class ShoppingList {
  @PrimaryGeneratedColumn('uuid') // ID único generado automáticamente
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) // Nombre opcional
  name: string;

  @ManyToOne(() => User, (user) => user.shoppingLists) // Relación con el usuario
  @JoinColumn({ name: 'user_id' }) // Columna de relación con el usuario
  user: User;

  @OneToMany(() => ShoppingListItem, (item) => item.shoppingList, {
    cascade: true, // Elimina los ítems si se elimina la lista
  })
  items: ShoppingListItem[]; // Relación con los ítems de la lista
}
