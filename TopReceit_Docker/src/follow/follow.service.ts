import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { User } from '../users/users.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Método para seguir a un usuario
  async followUser(followerId: string, followedId: string): Promise<Follow> {
    const follower = await this.userRepository.findOne({
      where: { id_user: followerId },
    });
    const followed = await this.userRepository.findOne({
      where: { id_user: followedId },
    });

    if (!follower || !followed) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const follow = this.followRepository.create({ follower, followed });
    return this.followRepository.save(follow);
  }

  // Método para dejar de seguir a un usuario
  async unfollowUser(followerId: string, followedId: string): Promise<void> {
    const follow = await this.followRepository.findOne({
      where: {
        follower: { id_user: followerId },
        followed: { id_user: followedId },
      },
    });

    if (!follow) {
      throw new NotFoundException('No se encontró la relación de seguimiento');
    }

    await this.followRepository.remove(follow);
  }

  // Método para obtener los usuarios que sigue un usuario
  async getFollowing(userId: string): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { follower: { id_user: userId } },
      relations: ['followed'],
    });

    return follows.map((follow) => follow.followed);
  }

  // Método para obtener los seguidores de un usuario
  async getFollowers(userId: string): Promise<User[]> {
    const follows = await this.followRepository.find({
      where: { followed: { id_user: userId } },
      relations: ['follower'],
    });

    return follows.map((follow) => follow.follower);
  }
}
