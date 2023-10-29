import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { WorkerModule } from './lib/modules/worker/worker.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(WorkerModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3100,
    },
  });
  app.listen();
}
bootstrap();
