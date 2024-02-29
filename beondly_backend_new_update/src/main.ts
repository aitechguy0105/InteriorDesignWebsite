// src/main.ts
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma-client-exception.filter';
import { Logger } from 'nestjs-pino';
import { readFileSync } from 'fs';
import { join } from 'path';
async function bootstrap() {

  const httpsOptions = {
    key: readFileSync(join(__dirname, '../../cert/privkey1.pem')),
    cert: readFileSync(join(__dirname, '../../cert/fullchain1.pem')),
  };
  //const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useLogger(app.get(Logger));

  const config = new DocumentBuilder()
    .setTitle('Get Restyle')
    .setDescription('Interior Room Design')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.enableCors({
    origin: '*',
  });
  // app.enableCors({
  //   origin: /https?:\/\/(([^/]+\.)?example\.com)$/i,
  // });
  const port = process.env.PORT || 8080;
  await app.listen(port);
  console.log(`Server is running : ${port}`);
}
bootstrap();
