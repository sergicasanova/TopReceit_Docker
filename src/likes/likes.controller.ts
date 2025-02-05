import { Controller, Post, Delete, Param, Get, Body } from '@nestjs/common';
import { LikeService } from './likes.service';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  async giveLike(@Body() createLikeDto: { userId: string; recipeId: number }) {
    return this.likeService.giveLike(
      createLikeDto.userId,
      createLikeDto.recipeId,
    );
  }

  @Delete()
  async removeLike(
    @Body() removeLikeDto: { userId: string; recipeId: number },
  ) {
    return this.likeService.removeLike(
      removeLikeDto.userId,
      removeLikeDto.recipeId,
    );
  }

  @Get(':recipeId')
  async getLikesCount(@Param('recipeId') recipeId: number) {
    return this.likeService.countLikes(recipeId);
  }

  @Get(':recipeId/users')
  async getLikes(@Param('recipeId') recipeId: number) {
    return this.likeService.getLikes(recipeId);
  }
}
