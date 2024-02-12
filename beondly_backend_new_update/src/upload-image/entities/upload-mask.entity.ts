import { ApiProperty } from '@nestjs/swagger';

export class UploadMaskEntity {
  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;
}
