import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { SharedModule } from '../shared/shared.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueController } from './queue.controller';
import { WORKER_SERVICE } from '../../../constants';

@Module({
  imports: [
    SharedModule,
    ClientsModule.register([
      {
        name: WORKER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3100,
        }
      }
    ]),
  ],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService]
})
export class QueueModule {}
