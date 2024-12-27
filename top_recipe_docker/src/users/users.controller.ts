import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    updateUserDto.id = id;
    return this.userService.updateUser(updateUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}