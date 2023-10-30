import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job, JobStatus } from './entities/job.entity';
import { QueueModule } from './queue.module';
import { mainEntities } from '../../../../test/helpers';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WORKER_SERVICE } from '../../../constants';

describe('QueueService', () => {
  let queueService: QueueService;

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
      providers: [QueueService],
    }).compile();

    queueService = module.get<QueueService>(QueueService);
  });

  it('should be defined', () => {
    expect(queueService).toBeDefined();
  });

  it('should create a new job', async () => {
    await queueService.addJob({
      name: '@test',
      task: 1,
      priority: 0
    });

    const jobs = await queueService.fetchJobsByStatus(JobStatus.QUEUED);
    expect(jobs).toBeTruthy();
    expect(jobs).toHaveLength(1);
    await queueService.deleteJob(jobs[0].id);
  });
});