import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { PriceService } from './price.service';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { AccessTokenGuard } from 'src/util/guards/accessToken.guard';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PriceEntity } from './entities/price.entity';

@Controller('price')
@ApiTags('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PriceEntity })
  async create(@Body() createPriceDto: CreatePriceDto) {
    return await this.priceService.create(createPriceDto);
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PriceEntity, isArray: true })
  async findAll() {
    const prices = await this.priceService.findAll();
    return prices.map((price) => price);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PriceEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.priceService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PriceEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePriceDto: UpdatePriceDto,
  ) {
    return await this.priceService.update(id, updatePriceDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: PriceEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.priceService.remove(id);
  }
}
