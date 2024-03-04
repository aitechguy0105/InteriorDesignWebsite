import { Plan } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PlanEntity implements Plan {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  planName: string;

  @ApiProperty()
  planNameJP: string;

  @ApiProperty()
  download: boolean;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  active: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
