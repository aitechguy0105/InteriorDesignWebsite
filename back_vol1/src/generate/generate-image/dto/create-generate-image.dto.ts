import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateGenerateImageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  prompt: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  baseUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  method: string;

  // @IsInt()
  // @IsNotEmpty()
  // @ApiProperty()
  // baseimageId: number;

  // @IsInt()
  // @IsNotEmpty()
  // @ApiProperty()
  // roomstyleId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  url: string[];
}
