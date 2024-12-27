import {
  // MiddlewareConsumer,
  Module,
  NestModule,
  // RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/users.entity';
// import { AuthorizationMiddleware } from './authorization.middleware';
// import { AuthService } from './Autentication/auth.service';
import { MailModule } from './mail/mail.module';
import { UploadModule } from './upload/upload.module';
import { UploadEntity } from './upload/upload.entity';
import { FilesModule } from './files/files.module';
// import { MongooseModule } from '@nestjs/mongoose';
import { Steps } from './steps/steps.entity';
import { Recipe } from './recipe/recipe.entity';
import { RecipeIngredient } from './recipe_ingredient/recipe_ingredient.entity';
import { StepsModule } from './steps/steps.module';
import { RecipeIngredientModule } from './recipe_ingredient/recipe_ingredient.module';
import { RecipeModule } from './recipe/recipe.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get<string>('MONGODB_URI'),
    //   }),
    //   inject: [ConfigService],
    // }),
    RecipeModule,
    RecipeIngredientModule,
    StepsModule,
    UsersModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UploadModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'topRecipe-db',
        port: +configService.get('MYSQL_PORT') || 3306,
        username: configService.get('MYSQL_USER'),
        password: configService.get('MYSQL_PASSWORD'),
        database: configService.get('MYSQL_DATABASE'),
        entities: [
          Recipe,
          User,
          UploadEntity,
          Steps,
          Recipe,
          RecipeIngredient,
          RecipeIngredient,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    FilesModule,
  ],
  controllers: [],
  providers: [
    // AuthorizationMiddleware,
    // AuthService,
  ],
})
export class AppModule implements NestModule {
  configure() {
    // consumer: MiddlewareConsumer
    // consumer
    //   .apply(AuthorizationMiddleware)
    //   .exclude({ path: 'users/login', method: RequestMethod.POST })
    //   .forRoutes('*');
  }
}
