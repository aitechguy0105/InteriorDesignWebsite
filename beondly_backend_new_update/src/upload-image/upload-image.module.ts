import { Module } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { UploadImageController } from './upload-image.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [UploadImageController],
  providers: [UploadImageService, PrismaService],
  imports: [PrismaService, UsersModule],
})
export class UploadImageModule {}
