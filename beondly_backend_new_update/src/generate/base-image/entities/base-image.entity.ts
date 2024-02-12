import { ApiProperty } from '@nestjs/swagger';
import { BaseImage } from '@prisma/client';

export class BaseImageEntity implements BaseImage {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  jpname: string;

  @ApiProperty()
  prompt: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
