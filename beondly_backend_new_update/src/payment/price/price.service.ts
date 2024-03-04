import { Injectable } from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PriceService {
  constructor(private prisma: PrismaService) {}

  async create(createPriceDto: CreatePriceDto) {
    return await this.prisma.price.create({ data: createPriceDto });
  }

  async findAll() {
    return await this.prisma.price.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.price.findUnique({ where: { id } });
  }

  async update(id: number, updatePriceDto: UpdatePriceDto) {
    return await this.prisma.price.update({
      where: { id },
      data: updatePriceDto,
    });
  }

  async remove(id: number) {
    return this.prisma.price.delete({ where: { id } });
  }
}
