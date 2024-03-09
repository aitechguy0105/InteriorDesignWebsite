import { IsBoolean, IsNotEmpty } from 'class-validator';

export class VerifyemailDto {
  @IsBoolean()
  @IsNotEmpty()
  verifyemail: boolean;
}
