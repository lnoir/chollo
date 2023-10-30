import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { SharedModule } from '../shared/shared.module';
import { DocsModule } from '../docs/docs.module';
import { TasksService } from './tasks.service';
import { DocsService } from '../docs/docs.service';
import { setupTestDocs } from '../../../../test/helpers';
import { testTypeOrmImportMain } from '../../../../test/pre-configured.imports';

jest.setTimeout(120000);

describe('TasksController', () => {
  let controller: TasksController;
  let docsService: DocsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        testTypeOrmImportMain,
        SharedModule,
        DocsModule,
      ],
      controllers: [TasksController],
      providers: [TasksService]
    }).compile();

    controller = module.get<TasksController>(TasksController);
    docsService = module.get<DocsService>(DocsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it ('should create a scheduled task', async () => {
    const { format, source } = await setupTestDocs({docsService});
    const scheduled = new Date();
    scheduled.setDate(scheduled.getDate() + 1);
    const task = await controller.createScheduledTask({
      source: source.id,
      format: format.id,
      scheduled: scheduled.toISOString()
    });
    expect(task).toBeTruthy();
    expect(task.constructor.name).toBe('TaskScheduled');
    expect(task).toHaveProperty('id');
  });

  it('should list scheduled tasks', async () => {
    const { format, source } = await setupTestDocs({docsService});
    const scheduled = new Date();
    scheduled.setDate(scheduled.getDate() + 1);
    await controller.createScheduledTask({
      source: source.id,
      format: format.id,
      scheduled: scheduled.toISOString()
    });
    const tasks = await controller.getScheduledTasks();
    expect(tasks).toBeTruthy();
    expect(tasks).toHaveLength(1);
  });

});
