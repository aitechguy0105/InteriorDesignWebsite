import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GenerateRestyleDto {
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
  url: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  originType: string;
}
