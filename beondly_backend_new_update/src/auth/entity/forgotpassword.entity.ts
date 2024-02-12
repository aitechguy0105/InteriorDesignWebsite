import { ApiProperty } from '@nestjs/swagger';

export class ForgotpasswordEntity {
  @ApiProperty()
  sendmailState: boolean;

  @ApiProperty()
  email: string;
}
