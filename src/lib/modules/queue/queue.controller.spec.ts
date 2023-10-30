import { Test, TestingModule } from '@nestjs/testing';
import { QueueController } from './queue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mainEntities } from '../../../../test/helpers';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WORKER_SERVICE } from '../../../constants';
import { Job } from './entities/job.entity';
import { QueueService } from './queue.service';

describe('QueueController', () => {
  let controller: QueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: mainEntities,
          synchronize: true,
        }),
        TypeOrmModule.forRoot({
          name: 'queue',
          type: 'sqlite',
          database: ':memory:',
          entities: [
            Job
          ],
          synchronize: true,
        }),
        ClientsModule.register([
          {
            name: WORKER_SERVICE,
            transport: Transport.TCP,
            options: {
              host: 'localhost',
              port: 3100,
            }
          }
        ])
      ],
      controllers: [QueueController],
      providers: [QueueService],
    }).compile();

    controller = module.get<QueueController>(QueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
