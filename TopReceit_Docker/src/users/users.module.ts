import { Module } from '@nestjs/common';
import { User } from './users.entity';
import { UserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './users.service';
import { NotificationModule } from 'src/notification/notification.module';
import { AuthService } from 'src/Autentication/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), NotificationModule],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UsersModule {}
