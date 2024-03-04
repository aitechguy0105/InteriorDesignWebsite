import { PartialType } from '@nestjs/swagger';
import { CreateRoomNameDto } from './create-room-name.dto';

export class UpdateRoomNameDto extends PartialType(CreateRoomNameDto) {}
