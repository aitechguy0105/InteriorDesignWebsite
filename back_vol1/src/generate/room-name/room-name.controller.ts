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
import { RoomNameService } from './room-name.service';
import { CreateRoomNameDto } from './dto/create-room-name.dto';
import { UpdateRoomNameDto } from './dto/update-room-name.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoomNameEntity } from './entities/room-name.entity';
import { AccessTokenGuard } from 'src/util/guards/accessToken.guard';

@Controller('room-name')
@ApiTags('room-name')
export class RoomNameController {
  constructor(private readonly roomNameService: RoomNameService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: RoomNameEntity })
  create(@Body() createRoomNameDto: CreateRoomNameDto) {
    return this.roomNameService.create(createRoomNameDto);
  }

  @Get()
  @ApiCreatedResponse({ type: RoomNameEntity, isArray: true })
  findAll() {
    return this.roomNameService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: RoomNameEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roomNameService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: RoomNameEntity })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoomNameDto: UpdateRoomNameDto,
  ) {
    return this.roomNameService.update(id, updateRoomNameDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: RoomNameEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roomNameService.remove(id);
  }
}
