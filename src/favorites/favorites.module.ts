import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { Favorite } from './favorites.entity';
import { NotificationModule } from '../notification/notification.module';
import { UsersModule } from '../users/users.module';
import { RecipeModule } from '../recipe/recipe.module';
import { User } from '../users/users.entity';
import { Recipe } from '../recipe/recipe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite, User, Recipe]),
    NotificationModule,
    UsersModule,
    RecipeModule,
  ],
  providers: [FavoritesService],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
