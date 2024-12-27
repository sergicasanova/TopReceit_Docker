import { Module } from '@nestjs/common';
import { User } from './users.entity';
import { UserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
