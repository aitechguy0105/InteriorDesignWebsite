import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateBaseImageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  jpname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  prompt: string;

  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  url: string;
}
