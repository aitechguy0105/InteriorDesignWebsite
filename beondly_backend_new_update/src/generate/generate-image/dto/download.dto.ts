import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class DownloadDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fileurl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  filename: string;
}
