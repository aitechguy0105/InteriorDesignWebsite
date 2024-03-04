import { ApiProperty } from '@nestjs/swagger';

export class DownloadImageEntity {
  @ApiProperty()
  path: string;

  @ApiProperty()
  name: string;
}
