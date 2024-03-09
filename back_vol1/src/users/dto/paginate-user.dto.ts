import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class PaginateUserDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  skip: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  take: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  orderBy: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  order: string;
}
