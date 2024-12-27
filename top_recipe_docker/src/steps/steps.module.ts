import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Steps } from './steps.entity';
import { StepsController } from './steps.controller';
import { StepsService } from './steps.service';

@Module({
  imports: [TypeOrmModule.forFeature([Steps])],
  controllers: [StepsController],
  providers: [StepsService],
  exports: [StepsService],
})
export class StepsModule {}
