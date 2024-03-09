import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class MyProjectDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;
}
