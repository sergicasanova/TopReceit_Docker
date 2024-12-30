import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { id, email, username } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const newUser = this.userRepository.create({
      id,
      email,
      username,
    });

    return await this.userRepository.save(newUser);
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: updateUserDto.id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    this.userRepository.merge(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }
}
