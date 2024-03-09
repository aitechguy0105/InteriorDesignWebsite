import { Injectable } from '@nestjs/common';
import { CreateRoomNameDto } from './dto/create-room-name.dto';
import { UpdateRoomNameDto } from './dto/update-room-name.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoomNameService {
  constructor(private prisma: PrismaService) {}

  create(createRoomNameDto: CreateRoomNameDto) {
    return this.prisma.roomName.create({ data: createRoomNameDto });
  }

  findAll() {
    return this.prisma.roomName.findMany();
  }

  findOne(id: number) {
    return this.prisma.roomName.findUnique({ where: { id } });
  }

  update(id: number, updateRoomNameDto: UpdateRoomNameDto) {
    return this.prisma.roomName.update({
      where: { id },
      data: updateRoomNameDto,
    });
  }

  remove(id: number) {
    return this.prisma.roomName.delete({ where: { id } });
  }
}
