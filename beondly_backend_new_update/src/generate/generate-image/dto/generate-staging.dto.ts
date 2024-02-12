import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GenerateStagingDto {
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
  maskUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  url: string[];

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  width: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  height: number;
}
