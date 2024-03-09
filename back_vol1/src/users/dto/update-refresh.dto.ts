import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateRefreshDto {
  @IsString()
  @IsNotEmpty()
  refreshtoken: string;
}
