import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';

export class MeEntity {
  @ApiProperty()
  userInfo: UserEntity;
}
