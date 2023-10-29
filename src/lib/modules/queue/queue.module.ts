import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { SharedModule } from '../shared/shared.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    SharedModule,
    ClientsModule.register([
      {
        name: 'WORKER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3100,
        }
      }
    ]),
  ],
  providers: [QueueService]
})
export class QueueModule {}
