import { PartialType } from '@nestjs/mapped-types';
import { CreateGenerateImageDto } from './create-generate-image.dto';

export class UpdateGenerateImageDto extends PartialType(
  CreateGenerateImageDto,
) {}
