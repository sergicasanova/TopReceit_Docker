import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './likes.entity';
import { LikeService } from './likes.service';
import { LikeController } from './likes.controller';
import { NotificationModule } from 'src/notification/notification.module';
import { UsersModule } from 'src/users/users.module';
import { RecipeModule } from 'src/recipe/recipe.module';
import { User } from 'src/users/users.entity';
import { Recipe } from 'src/recipe/recipe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, User, Recipe]),
    NotificationModule,
    UsersModule,
    RecipeModule,
  ],
  providers: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
