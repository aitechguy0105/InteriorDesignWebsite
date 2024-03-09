import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from 'src/util/mail/mail.service';

export const jwtSecret = 'zjP9h6ZI5LoSKCRj';

@Module({
  controllers: [UsersController],
  providers: [UsersService, AuthService, MailService],
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: jwtSecret,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  exports: [UsersService],
})
export class UsersModule {}
