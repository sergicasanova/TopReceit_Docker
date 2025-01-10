import { Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/users.entity';
// import { AuthorizationMiddleware } from './authorization.middleware';
// import { AuthService } from './Autentication/auth.service';
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

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'), // Carpeta donde se guardan las imágenes
      serveRoot: '/uploads', // URL pública para acceder a las imágenes
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
        entities: [User, Recipe, IngredientEntity, RecipeIngredient, Steps],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    LabelsModule,
    RecipeModule,
    IngredientModule,
    RecipeIngredientModule,
    StepsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure() {
    // Aquí irían configuraciones de middleware si es necesario
  }
}
