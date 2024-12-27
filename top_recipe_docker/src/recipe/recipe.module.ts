import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  exports: [TypeOrmModule, RecipeService],
  controllers: [RecipeController],
  providers: [RecipeController],
})
export class RecipeModule {}
