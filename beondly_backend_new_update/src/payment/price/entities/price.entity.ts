import { ApiProperty } from '@nestjs/swagger';
import { Price } from '@prisma/client';

export class PriceEntity implements Price {
  @ApiProperty()
  id: number;

  @ApiProperty()
  priceName: string;

  @ApiProperty()
  priceNameJP: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
