import { ApiProperty } from '@nestjs/swagger';

export class RegisterEntity {
  @ApiProperty()
  sendverifymailstate: boolean;

  @ApiProperty()
  email: string;
}
