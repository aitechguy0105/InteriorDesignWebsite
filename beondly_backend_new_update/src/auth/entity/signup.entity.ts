import { ApiProperty } from '@nestjs/swagger';

export class SignupEntity {
  @ApiProperty()
  sendverifymailstate: boolean;

  @ApiProperty()
  email: string;
}
