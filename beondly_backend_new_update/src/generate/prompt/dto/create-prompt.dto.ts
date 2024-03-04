import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePromptDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  roomNameId: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  designStyleId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  prompt: string;
}
