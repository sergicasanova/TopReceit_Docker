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
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from '../Autentication/auth.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios encontrada',
  })
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id/profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener el perfil de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async getUserProfile(@Param('id') id: string) {
    return this.userService.getUserProfile(id);
  }

  @Post('login/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({
    status: 400,
    description: 'ID de usuario es requerido',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Param('id') id_user: string) {
    if (!id_user) {
      throw new HttpException(
        'ID de usuario es obligatorio',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const token = await this.authService.generateToken(id_user);

      // Devolver el token
      return { token };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error durante el inicio de sesión',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Usuario creado con éxito',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta',
  })
  @ApiResponse({
    status: 409,
    description: 'Usuario ya existe',
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiBody({ type: UpdateUserDto })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    updateUserDto.id_user = id;
    return this.userService.updateUser(updateUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async findOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario por ID' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado con éxito',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  async remove(@Param('id') id: string) {
    return this.userService.removeUser(id);
  }

  @Put(':id/token')
  @ApiOperation({ summary: 'Token variable desde el frontend' })
  @ApiBearerAuth()
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
