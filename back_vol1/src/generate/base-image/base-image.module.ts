import { Module } from '@nestjs/common';
import { BaseImageService } from './base-image.service';
import { BaseImageController } from './base-image.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BaseImageController],
  providers: [BaseImageService],
  imports: [PrismaModule],
})
export class BaseImageModule {}
