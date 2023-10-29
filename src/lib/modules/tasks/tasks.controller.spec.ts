import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocSource } from '../docs/entities/doc-source.entity';
import { DocFormat } from '../docs/entities/doc-format.entity';
import { DocConfig } from '../docs/entities/doc-config.entity';
import { Doc } from '../docs/entities/doc.entity';
import { TaskScheduled } from './entities/task-scheduled.entity';
import { TaskActive } from './entities/task-active.entity';
import { TaskLogged } from './entities/task-logged.entity';
import { SharedModule } from '../shared/shared.module';
import { DocsModule } from '../docs/docs.module';
import { TasksService } from './tasks.service';
import { DocsService } from '../docs/docs.service';
import { setupTestDocs } from '../../../../test/helpers';

jest.setTimeout(120000);

describe('TasksController', () => {
  let controller: TasksController;
  let docsService: DocsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SharedModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [DocSource, DocFormat, DocConfig, Doc, TaskScheduled, TaskActive, TaskLogged],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([DocSource, DocFormat, DocConfig, Doc]),
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
    expect(task.constructor.name).toBe('ScheduledTask');
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
