import { Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/users.entity';
import { MailModule } from './mail/mail.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Steps } from './steps/steps.entity';
import { Recipe } from './recipe/recipe.entity';
import { RecipeIngredient } from './recipe_ingredient/recipe_ingredient.entity';
import { StepsModule } from './steps/steps.module';
import { RecipeIngredientModule } from './recipe_ingredient/recipe_ingredient.module';
import { RecipeModule } from './recipe/recipe.module';
import { IngredientEntity } from './ingredient/ingredient.entity';
import { IngredientModule } from './ingredient/ingredient.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'toprecipe-db',
        port: +configService.get('MYSQL_PORT') || 3306,
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [Recipe, User, Steps, RecipeIngredient, IngredientEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    RecipeModule,
    RecipeIngredientModule,
    StepsModule,
    UsersModule,
    MailModule,
    IngredientModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure() {
    // consumer
    //   .apply(AuthorizationMiddleware)
    //   .exclude({ path: 'users/login', method: RequestMethod.POST })
    //   .forRoutes('*');
  }
}
