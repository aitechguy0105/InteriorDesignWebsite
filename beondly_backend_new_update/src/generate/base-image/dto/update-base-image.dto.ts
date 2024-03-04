import { PartialType } from '@nestjs/mapped-types';
import { CreateBaseImageDto } from './create-base-image.dto';

export class UpdateBaseImageDto extends PartialType(CreateBaseImageDto) {}
