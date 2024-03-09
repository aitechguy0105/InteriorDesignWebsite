import { ApiProperty } from '@nestjs/swagger';
import { RoomName } from '@prisma/client';

export class RoomNameEntity implements RoomName {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  jpName: string;

  @ApiProperty()
  prompt: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
