import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UploadNoneMaskDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  width: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  height: number;
}
