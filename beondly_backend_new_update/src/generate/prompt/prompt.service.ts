import { Injectable } from '@nestjs/common';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PromptService {
  constructor(private prisma: PrismaService) {}

  async create(createPromptDto: CreatePromptDto) {
    return await this.prisma.prompt.create({ data: createPromptDto });
  }

  findAll() {
    return `This action returns all prompt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prompt`;
  }

  update(id: number, updatePromptDto: UpdatePromptDto) {
    return `This action updates a #${id} prompt`;
  }

  remove(id: number) {
    return `This action removes a #${id} prompt`;
  }
}
