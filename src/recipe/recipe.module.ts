import { Global, Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/users.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Recipe, User]), UsersModule],
  providers: [RecipeService],
  controllers: [RecipeController],
  exports: [RecipeService],
})
export class RecipeModule {}
