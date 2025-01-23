import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
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
    updateUserDto.id_user = id;
    return this.userService.updateUser(updateUserDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.removeUser(id);
  }
}
