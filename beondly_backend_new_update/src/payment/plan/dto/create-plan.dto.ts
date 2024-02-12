import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsBoolean } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  planName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  planNameJP: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  download: boolean;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  limit: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  active: boolean;
}
