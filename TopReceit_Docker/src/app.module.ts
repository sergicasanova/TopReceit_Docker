import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/users.entity';
import { LabelsModule } from './utils/labels.module';
// import { MongooseModule } from '@nestjs/mongoose';
import { Recipe } from './recipe/recipe.entity';
import { IngredientEntity } from './ingredient/ingredient.entity';
import { RecipeIngredient } from './recipe_ingredient/recipe_ingredient.entity';
import { Steps } from './steps/steps.entity';
import { RecipeModule } from './recipe/recipe.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { RecipeIngredientModule } from './recipe_ingredient/recipe_ingredient.module';
import { StepsModule } from './steps/steps.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { Favorite } from './favorites/favorites.entity';
import { FavoritesModule } from './favorites/favorites.module';
import { Like } from './likes/likes.entity';
import { LikeModule } from './likes/likes.module';
import { NotificationModule } from './notification/notification.module';
import { Follow } from './follow/follow.entity';
import { FollowModule } from './follow/follow.module';
import { AuthorizationMiddleware } from './authorization.middleware';
import { AuthService } from './Autentication/auth.service';
import { ShoppingList } from './shopping_list/shopping_list.entity';
import { ShoppingListItem } from './shopping_list/shopping_list_item.entity';
import { ShoppingListModule } from './shopping_list/shopping_list.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ConfigModule.forRoot(),
    UsersModule,
    UtilsModule,
    LabelsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([
      User,
      Recipe,
      IngredientEntity,
      RecipeIngredient,
      Steps,
      Favorite,
      Like,
      Follow,
      ShoppingList,
      ShoppingListItem,
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('MYSQL_HOST'),
        port: +configService.get('MYSQL_PORT') || 3306,
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [
          User,
          Recipe,
          IngredientEntity,
          RecipeIngredient,
          Steps,
          Favorite,
          Like,
          Follow,
          ShoppingList,
          ShoppingListItem,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    LabelsModule,
    RecipeModule,
    IngredientModule,
    RecipeIngredientModule,
    StepsModule,
    FavoritesModule,
    LikeModule,
    NotificationModule,
    FollowModule,
    ShoppingListModule,
  ],
  controllers: [],
  providers: [AuthorizationMiddleware, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthorizationMiddleware)
      .exclude(
        { path: 'users/login/:id', method: RequestMethod.POST },
        { path: 'users', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
