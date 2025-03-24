import {
  Controller,
  Post,
  Delete,
  Param,
  Get,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { LikeService } from './likes.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateLikeDto, RemoveLikeDto } from './likes.dto';

@ApiTags('likes')
@ApiBearerAuth()
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @ApiOperation({ summary: 'Dar un like a una receta' })
  @ApiResponse({
    status: 201,
    description: 'Like dado con éxito',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta',
  })
  @ApiBody({ type: CreateLikeDto })
  async giveLike(@Body() createLikeDto: CreateLikeDto) {
    if (!createLikeDto.userId || !createLikeDto.recipeId) {
      throw new BadRequestException('Faltan parámetros en la solicitud');
    }

    return this.likeService.giveLike(
      createLikeDto.userId,
      createLikeDto.recipeId,
    );
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar un like de una receta' })
  @ApiResponse({
    status: 200,
    description: 'Like eliminado con éxito',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta',
  })
  @ApiBody({ type: RemoveLikeDto })
  async removeLike(@Body() removeLikeDto: RemoveLikeDto) {
    if (!removeLikeDto.userId || !removeLikeDto.recipeId) {
      throw new BadRequestException('Faltan parámetros en la solicitud');
    }
    return this.likeService.removeLike(
      removeLikeDto.userId,
      removeLikeDto.recipeId,
    );
  }

  @Get(':recipeId')
  @ApiOperation({ summary: 'Obtener el conteo de likes de una receta' })
  @ApiResponse({
    status: 200,
    description: 'Conteo de likes de la receta obtenido con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Receta no encontrada',
  })
  async getLikesCount(@Param('recipeId') recipeId: number) {
    return this.likeService.countLikes(recipeId);
  }

  @Get(':recipeId/users')
  @ApiOperation({
    summary: 'Obtener los usuarios que dieron like a una receta',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios que dieron like a la receta obtenidos con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Receta no encontrada',
  })
  async getLikes(@Param('recipeId') recipeId: number) {
    return this.likeService.getLikes(recipeId);
  }
}
