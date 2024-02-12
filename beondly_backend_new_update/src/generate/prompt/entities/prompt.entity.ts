import { Prompt } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class PromptEntity implements Prompt {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  roomNameId: number;

  @ApiProperty()
  designStyleId: number;

  @ApiProperty()
  prompt: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
