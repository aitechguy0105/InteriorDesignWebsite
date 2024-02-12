import { PartialType } from '@nestjs/swagger';
import { CreateUploadImageDto } from './create-upload-image.dto';

export class UpdateUploadImageDto extends PartialType(CreateUploadImageDto) {}
