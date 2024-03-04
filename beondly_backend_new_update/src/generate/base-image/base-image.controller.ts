import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { BaseImageService } from './base-image.service';
import { CreateBaseImageDto } from './dto/create-base-image.dto';
import { UpdateBaseImageDto } from './dto/update-base-image.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseImageEntity } from './entities/base-image.entity';
import { AccessTokenGuard } from 'src/util/guards/accessToken.guard';

@Controller('base-image')
@ApiTags('base-image')
export class BaseImageController {
  constructor(private readonly baseImageService: BaseImageService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: BaseImageEntity })
  create(@Body() createBaseImageDto: CreateBaseImageDto) {
    return this.baseImageService.create(createBaseImageDto);
  }

  @Get()
  @ApiCreatedResponse({ type: BaseImageEntity, isArray: true })
  findAll() {
    return this.baseImageService.findAll();
  }

  @Get(':id')
  @ApiCreatedResponse({ type: BaseImageEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.baseImageService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: BaseImageEntity })
  update(
    @Param('id') id: string,
    @Body() updateBaseImageDto: UpdateBaseImageDto,
  ) {
    return this.baseImageService.update(+id, updateBaseImageDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: BaseImageEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.baseImageService.remove(id);
  }
}
