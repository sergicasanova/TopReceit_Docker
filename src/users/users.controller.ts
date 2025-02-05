import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Get,
  Delete,
  HttpException,
  HttpStatus,
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

  @Put(':id/token')
  async updateTokenNotification(
    @Param('id') id: string,
    @Body('token_notificacion') tokenNotificacion: string,
  ) {
    if (!id || !tokenNotificacion) {
      throw new HttpException(
        'El ID del usuario y el token de notificación son obligatorios',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedUser = await this.userService.updateNotificationToken(
      id,
      tokenNotificacion,
    );

    if (!updatedUser) {
      throw new HttpException(
        'No se pudo actualizar el token de notificación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedUser;
  }
}
