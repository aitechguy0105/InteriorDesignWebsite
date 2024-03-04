import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GenerateImageService } from './generate-image.service';
import { GenerateImageController } from './generate-image.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [GenerateImageController],
  providers: [GenerateImageService],
  imports: [PrismaModule, HttpModule, UsersModule],
})
export class GenerateImageModule {}
