import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Recipe } from './recipe.entity';
import { CreateRecipeDto, UpdateRecipeDto } from './recipe.dto';
import { User } from '../users/users.entity';
import { Follow } from '../follow/follow.entity';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  async createRecipe(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const { title, description, user_id, image } = createRecipeDto;
    if (!user_id) {
      throw new BadRequestException('El ID de usuario es obligatorio.');
    }

    if (!title || title.trim() === '') {
      throw new BadRequestException(
        'El título de la receta es obligatorio y no puede estar vacío.',
      );
    }
    const user = { id_user: user_id };

    const newRecipe = this.recipeRepository.create({
      title,
      description,
      image,
      user,
    });

    try {
      return await this.recipeRepository.save(newRecipe);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Hubo un problema al crear la receta. Por favor, inténtelo nuevamente.',
      );
    }
  }

  async updateRecipe(
    id_recipe: number,
    updateRecipeDto: UpdateRecipeDto,
  ): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id_recipe },
    });

    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }

    Object.assign(recipe, updateRecipeDto);

    try {
      return await this.recipeRepository.save(recipe);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Hubo un problema al actualizar la receta. Por favor, inténtelo nuevamente.',
      );
    }
  }

  async getAllRecipes(): Promise<Recipe[]> {
    const recipes = await this.recipeRepository.find({
      relations: ['recipeIngredients', 'steps', 'user', 'likes.user'],
    });

    return recipes;
  }

  async getPublicRecipes(): Promise<Recipe[]> {
    const publicRecipes = await this.recipeRepository.find({
      where: { isPublic: true },
      relations: ['recipeIngredients', 'steps', 'user', 'likes.user'],
    });

    return publicRecipes;
  }

  async getUserPublicRecipes(userId: string): Promise<Recipe[]> {
    const userPublicRecipes = await this.recipeRepository.find({
      where: {
        isPublic: true,
        user: { id_user: userId },
      },
      relations: ['recipeIngredients', 'steps', 'user', 'likes.user'],
    });

    return userPublicRecipes;
  }

  async searchRecipesByTitle(title: string): Promise<Recipe[]> {
    return this.recipeRepository.find({
      where: {
        title: Like(`%${title}%`),
      },
    });
  }

  async getRecipesByUserId(userId: string): Promise<Recipe[]> {
    const userExists = await this.userRepository.findOne({
      where: { id_user: userId },
    });

    if (!userExists) {
      throw new NotFoundException('El ID de usuario no existe.');
    }

    const recipes = await this.recipeRepository.find({
      where: { user: { id_user: userId } },
      relations: ['recipeIngredients', 'steps', 'user'],
    });

    return recipes;
  }

  async getRecipeById(id_recipe: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({
      where: { id_recipe },
      relations: ['steps', 'recipeIngredients'],
    });
    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }
    return recipe;
  }

  async deleteRecipe(id_recipe: number): Promise<void> {
    const recipe = await this.recipeRepository.findOne({
      where: { id_recipe },
    });

    if (!recipe) {
      throw new NotFoundException('Receta no encontrada');
    }

    await this.recipeRepository.remove(recipe);
  }

  async getFilteredPublicRecipes(
    title?: string,
    steps?: number,
    ingredients?: number,
    followedUserIds?: string[],
  ): Promise<Recipe[]> {
    // Crear el query base para recetas publicadas
    let query = this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.recipeIngredients', 'recipeIngredients')
      .leftJoinAndSelect('recipe.steps', 'steps')
      .leftJoinAndSelect('recipe.user', 'user')
      .where('recipe.isPublic = :isPublic', { isPublic: true });

    // Filtrar por título
    if (title) {
      query = query.andWhere('recipe.title LIKE :title', {
        title: `%${title}%`,
      });
    }

    // Filtrar por número de pasos
    if (steps) {
      query = query.andWhere('steps.length <= :steps', { steps });
    }

    // Filtrar por número de ingredientes
    if (ingredients) {
      query = query.andWhere(
        'recipe.recipeIngredients.length <= :ingredients',
        { ingredients },
      );
    }

    // Filtrar por usuarios seguidos
    if (followedUserIds && followedUserIds.length > 0) {
      query = query.andWhere('user.id_user IN (:...followedUserIds)', {
        followedUserIds,
      });
    }

    // Ejecutar la consulta y devolver las recetas filtradas
    const filteredRecipes = await query.getMany();
    return filteredRecipes;
  }

  async getPublicRecipesByFollowing(userId: string): Promise<Recipe[]> {
    // 1. Obtener los IDs de los usuarios seguidos
    const follows = await this.followRepository.find({
      where: { follower: { id_user: userId } },
      relations: ['followed'],
    });

    const followedUserIds = follows
      .filter((follow) => follow.followed)
      .map((follow) => follow.followed.id_user);

    console.log('IDs de usuarios seguidos:', followedUserIds);

    if (followedUserIds.length === 0) {
      return [];
    }

    // 2. Filtrar las recetas públicas de estos usuarios
    const recipes = await this.recipeRepository.find({
      where: {
        isPublic: true,
        user: { id_user: In(followedUserIds) }, // Filtrar por IDs de usuarios seguidos
      },
      relations: ['user'], // Incluye los datos del usuario asociado a cada receta
    });

    return recipes;
  }
}
