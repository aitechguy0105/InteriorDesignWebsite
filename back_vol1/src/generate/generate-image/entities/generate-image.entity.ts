import { GenerateImage } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateImageEntity implements GenerateImage {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  prompt: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  baseUrl: string;

  @ApiProperty()
  method: string;

  @ApiProperty()
  url: string[];

  @ApiProperty()
  createdAt: Date;
}
