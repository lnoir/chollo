import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { WorkerModule } from './lib/modules/worker/worker.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(WorkerModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: process.env.CHOLLO_QUEUE_PORT,
    },
  });
  app.listen();
  console.log(`Worker running on port ${process.env.CHOLLO_QUEUE_PORT}`);
}
bootstrap();
