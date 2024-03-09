import { Module } from '@nestjs/common';
import { RoomNameService } from './room-name.service';
import { RoomNameController } from './room-name.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [RoomNameController],
  providers: [RoomNameService],
  imports: [PrismaModule],
})
export class RoomNameModule {}
