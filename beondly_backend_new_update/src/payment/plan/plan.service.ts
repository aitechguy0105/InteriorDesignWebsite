import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PlanService {
  constructor(private prisma: PrismaService) {}

  async create(createPlanDto: CreatePlanDto) {
    return await this.prisma.plan.create({ data: createPlanDto });
  }

  async findAll() {
    return await this.prisma.plan.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.plan.findUnique({ where: { id } });
  }

  async update(id: number, updatePlanDto: UpdatePlanDto) {
    return await this.prisma.plan.update({
      where: { id },
      data: updatePlanDto,
    });
  }

  remove(id: number) {
    return this.prisma.plan.delete({ where: { id } });
  }
}
