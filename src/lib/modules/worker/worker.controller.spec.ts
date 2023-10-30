import { Test, TestingModule } from '@nestjs/testing';
import { WorkerController } from './worker.controller';
import { testClientModuleImportMain, testClientModuleImportWorker, testConfigImport, testTypeOrmImportMain, testTypeOrmImportQueue } from '../../../../test/pre-configured.imports';
import { TasksModule } from '../tasks/tasks.module';
import { QueueModule } from '../queue/queue.module';
import { WorkerService } from './worker.service';

describe('WorkerController', () => {
  let controller: WorkerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        testConfigImport,
        testClientModuleImportMain,
        testTypeOrmImportMain,
        testTypeOrmImportQueue,
        TasksModule,
        QueueModule
      ],
      controllers: [WorkerController],
      providers: [WorkerService],
    }).compile();

    controller = module.get<WorkerController>(WorkerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
