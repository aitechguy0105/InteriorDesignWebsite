import { Injectable } from '@nestjs/common';
import { CreateBaseImageDto } from './dto/create-base-image.dto';
import { UpdateBaseImageDto } from './dto/update-base-image.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BaseImageService {
  constructor(private prisma: PrismaService) {}

  create(createBaseImageDto: CreateBaseImageDto) {
    return this.prisma.baseImage.create({ data: createBaseImageDto });
  }

  findAll() {
    return this.prisma.baseImage.findMany();
  }

  findOne(id: number) {
    return this.prisma.baseImage.findUnique({ where: { id } });
  }

  update(id: number, updateBaseImageDto: UpdateBaseImageDto) {
    return this.prisma.baseImage.update({
      where: { id },
      data: updateBaseImageDto,
    });
  }

  remove(id: number) {
    return this.prisma.baseImage.delete({ where: { id } });
  }
}
