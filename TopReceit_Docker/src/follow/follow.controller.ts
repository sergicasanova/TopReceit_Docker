import { Controller, Post, Param, Delete, Get } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('follows')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':followerId/follow/:followedId')
  async followUser(
    @Param('followerId') followerId: string,
    @Param('followedId') followedId: string,
  ) {
    return this.followService.followUser(followerId, followedId);
  }

  @Delete(':followerId/unfollow/:followedId')
  async unfollowUser(
    @Param('followerId') followerId: string,
    @Param('followedId') followedId: string,
  ) {
    return this.followService.unfollowUser(followerId, followedId);
  }

  @Get(':userId/following')
  async getFollowing(@Param('userId') userId: string) {
    return this.followService.getFollowing(userId);
  }

  @Get(':userId/followers')
  async getFollowers(@Param('userId') userId: string) {
    return this.followService.getFollowers(userId);
  }
}
