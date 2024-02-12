import { ApiProperty } from '@nestjs/swagger';

export interface userInfo {
  userId: number;
  userEmail: string;
  userName: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
export class SigninEntity {
  @ApiProperty()
  tokens: Tokens;

  @ApiProperty()
  userInfo: userInfo;

  @ApiProperty()
  userStatus: boolean;
}
