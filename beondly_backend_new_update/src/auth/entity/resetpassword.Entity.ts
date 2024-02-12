import { ApiProperty } from '@nestjs/swagger';
import { Tokens, userInfo } from './signin.entity';

export class ResetpasswordEntity {
  @ApiProperty()
  tokens: Tokens;

  @ApiProperty()
  userInfo: userInfo;

  @ApiProperty()
  userStatus: boolean;
}
