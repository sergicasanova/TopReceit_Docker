import { Favorite } from '../favorites/favorites.entity';
import { Recipe } from '../recipe/recipe.entity';
import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Like } from '../likes/likes.entity';

@Entity('users')
export class User {
  @PrimaryColumn()
  id_user: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  // @Column({ type: 'timestamp', nullable: true })
  // tokenExpiration: Date;

  // @Column({ nullable: true })
  // token: string;

  @Column({ default: 2 })
  role: number;

  @Column('simple-array', { nullable: true })
  preferences: string[];

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  notification_token: string;

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  // @OneToMany(() => ShoppingList, (shoppingList) => shoppingList.user)
  // shoppingLists: ShoppingList[];
}
