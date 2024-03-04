import { UploadImage } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UploadImageEntity implements UploadImage {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  authorId: number;
}
