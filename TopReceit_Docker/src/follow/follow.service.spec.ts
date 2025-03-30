import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowService } from './follow.service';
import { Follow } from './follow.entity';
import { User } from '../users/users.entity';
import { NotFoundException } from '@nestjs/common';

describe('FollowService', () => {
  let service: FollowService;
  let followRepository: Repository<Follow>;
  let userRepository: Repository<User>;

  // Mock data
  const mockFollower: User = {
    id_user: 'follower123',
    username: 'followerUser',
    avatar: 'avatar1.jpg',
    preferences: {},
  } as User;

  const mockFollowed: User = {
    id_user: 'followed456',
    username: 'followedUser',
    avatar: 'avatar2.jpg',
    preferences: {},
  } as User;

  const mockFollow: Follow = {
    id: 'follow-123',
    follower: mockFollower,
    followed: mockFollowed,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowService,
        {
          provide: getRepositoryToken(Follow),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FollowService>(FollowService);
    followRepository = module.get<Repository<Follow>>(
      getRepositoryToken(Follow),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('followUser', () => {
    it('should create a follow relationship successfully', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(mockFollower)
        .mockResolvedValueOnce(mockFollowed);
      jest.spyOn(followRepository, 'create').mockReturnValue(mockFollow);
      jest.spyOn(followRepository, 'save').mockResolvedValue(mockFollow);

      const result = await service.followUser('follower123', 'followed456');

      expect(result).toEqual(mockFollow);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id_user: 'follower123' },
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id_user: 'followed456' },
      });
      expect(followRepository.create).toHaveBeenCalledWith({
        follower: mockFollower,
        followed: mockFollowed,
      });
    });

    it('should throw NotFoundException if follower does not exist', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockFollowed);

      await expect(
        service.followUser('nonexistent', 'followed456'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if followed user does not exist', async () => {
      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(mockFollower)
        .mockResolvedValueOnce(null);

      await expect(
        service.followUser('follower123', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('unfollowUser', () => {
    it('should remove a follow relationship successfully', async () => {
      jest.spyOn(followRepository, 'findOne').mockResolvedValue(mockFollow);
      jest.spyOn(followRepository, 'remove').mockResolvedValue(mockFollow);

      await service.unfollowUser('follower123', 'followed456');

      expect(followRepository.findOne).toHaveBeenCalledWith({
        where: {
          follower: { id_user: 'follower123' },
          followed: { id_user: 'followed456' },
        },
      });
      expect(followRepository.remove).toHaveBeenCalledWith(mockFollow);
    });

    it('should throw NotFoundException if follow relationship does not exist', async () => {
      jest.spyOn(followRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.unfollowUser('follower123', 'followed456'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFollowing', () => {
    it('should return list of users being followed', async () => {
      const mockFollows = [mockFollow];
      jest.spyOn(followRepository, 'find').mockResolvedValue(mockFollows);

      const result = await service.getFollowing('follower123');

      expect(result).toEqual([
        {
          id_user: 'followed456',
          username: 'followedUser',
          avatar: 'avatar2.jpg',
          preferences: {},
        },
      ]);
      expect(followRepository.find).toHaveBeenCalledWith({
        where: { follower: { id_user: 'follower123' } },
        relations: ['followed'],
      });
    });

    it('should return empty array if user follows no one', async () => {
      jest.spyOn(followRepository, 'find').mockResolvedValue([]);

      const result = await service.getFollowing('follower123');

      expect(result).toEqual([]);
    });

    it('should filter out null followed users', async () => {
      const mockFollowWithNull = {
        ...mockFollow,
        followed: null,
      };
      jest
        .spyOn(followRepository, 'find')
        .mockResolvedValue([mockFollowWithNull]);

      const result = await service.getFollowing('follower123');

      expect(result).toEqual([]);
    });
  });

  describe('getFollowers', () => {
    it('should return list of followers', async () => {
      const mockFollows = [mockFollow];
      jest.spyOn(followRepository, 'find').mockResolvedValue(mockFollows);

      const result = await service.getFollowers('followed456');

      expect(result).toEqual([
        {
          id_user: 'follower123',
          username: 'followerUser',
          avatar: 'avatar1.jpg',
          preferences: {},
        },
      ]);
      expect(followRepository.find).toHaveBeenCalledWith({
        where: { followed: { id_user: 'followed456' } },
        relations: ['follower'],
      });
    });

    it('should return empty array if user has no followers', async () => {
      jest.spyOn(followRepository, 'find').mockResolvedValue([]);

      const result = await service.getFollowers('followed456');

      expect(result).toEqual([]);
    });

    it('should filter out null follower users', async () => {
      const mockFollowWithNull = {
        ...mockFollow,
        follower: null,
      };
      jest
        .spyOn(followRepository, 'find')
        .mockResolvedValue([mockFollowWithNull]);

      const result = await service.getFollowers('followed456');

      expect(result).toEqual([]);
    });
  });
});
