import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreatePriceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  priceName: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  unit: string;
}
