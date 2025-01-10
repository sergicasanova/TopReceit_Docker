import {
  Controller,
  Post,
  Put,
  Get,
  Query,
  Param,
  Body,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto, UpdateRecipeDto } from './recipe.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';

@Controller('recipe')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const fileName =
            path.parse(file.originalname).name.replace(/\s/g, '') +
            '-' +
            Date.now() +
            path.extname(file.originalname);
          callback(null, fileName);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    const image = file ? file.filename : null;

    return this.recipeService.createRecipe(createRecipeDto, image);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipeService.updateRecipe(id, updateRecipeDto);
  }

  @Get()
  async findAll() {
    return this.recipeService.getAllRecipes();
  }

  @Get('search')
  async search(@Query('title') title: string) {
    return this.recipeService.searchRecipesByTitle(title);
  }

  @Get('user/:userId')
  async getRecipesByUser(@Param('userId') userId: string) {
    return this.recipeService.getRecipesByUserId(userId);
  }

  @Get(':id')
  async getRecipe(@Param('id') id: number) {
    return this.recipeService.getRecipeById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.recipeService.deleteRecipe(id);
  }
}
