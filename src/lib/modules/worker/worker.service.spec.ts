import { Test, TestingModule } from '@nestjs/testing';
import { WorkerService } from './worker.service';
import { testClientModuleImportMain, testConfigImport, testTypeOrmImportMain, testTypeOrmImportQueue } from '../../../../test/pre-configured.imports';
import { TasksModule } from '../tasks/tasks.module';
import { QueueModule } from '../queue/queue.module';

describe('WorkerService', () => {
  let service: WorkerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        testConfigImport,
        testClientModuleImportMain,
        testTypeOrmImportMain,
        testTypeOrmImportQueue,
        QueueModule,
        TasksModule
      ],
      providers: [WorkerService],
    }).compile();

    service = module.get<WorkerService>(WorkerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
