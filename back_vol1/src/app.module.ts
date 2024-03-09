import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ArticlesModule } from './articles/articles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RoomNameModule } from './generate/room-name/room-name.module';
import { BaseImageModule } from './generate/base-image/base-image.module';
import { GenerateImageModule } from './generate/generate-image/generate-image.module';
import { MailModule } from './util/mail/mail.module';
import { UploadImageModule } from './upload-image/upload-image.module';
import { MulterModule } from '@nestjs/platform-express';
import configuration from './config/configuration';
import { PriceModule } from './payment/price/price.module';
import { PlanModule } from './payment/plan/plan.module';
import { RolesGuard } from './util/roles/roles.guards';
import { LoggerModule } from 'nestjs-pino';
@Module({
  imports: [
    PrismaModule,
    ArticlesModule,
    UsersModule,
    AuthModule,
    RoomNameModule,
    BaseImageModule,
    GenerateImageModule,
    UploadImageModule,
    PriceModule,
    PlanModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MailModule,
    MulterModule.register({
      dest: './upload',
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule {}
