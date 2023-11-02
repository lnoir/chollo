import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Chollo API')
    .setVersion('1.0')
    .build();
  app.enableCors({
    origin: '*'
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: process.env.CHOLLO_MAIN_PORT
    }
  })
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(process.env.CHOLLO_MAIN_PORT);
  console.log(`App running on port ${process.env.CHOLLO_MAIN_PORT}`);
}
bootstrap();
