import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { setupTestDocs, staticTestHost } from '../../../../test/helpers';
import { DocsService } from '../docs/docs.service';
import { SharedModule } from '../shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocSource } from '../docs/entities/doc-source.entity';
import { DocFormat } from '../docs/entities/doc-format.entity';
import { DocConfig } from '../docs/entities/doc-config.entity';
import { Doc } from '../docs/entities/doc.entity';
import { TaskScheduled } from './entities/task-scheduled.entity';
import { TaskActive } from './entities/task-active.entity';
import { TaskLogged } from './entities/task-logged.entity';
import { DocsModule } from '../docs/docs.module';
import { TaskOutput } from './entities/task-output.entity';
import { Runner } from './runner';
import { TaskStep } from './entities/task-step.entity';
import { cv0 } from '../../../../test/cvs/cv0';

jest.setTimeout(240000);

describe('TasksService', () => {
  let tasksService: TasksService;
  let docsService: DocsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SharedModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [
            DocSource, DocFormat, DocConfig, Doc,
            TaskScheduled, TaskStep, TaskActive, TaskLogged, TaskOutput
          ],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([DocSource, DocFormat, DocConfig, Doc]),
        DocsModule,
      ],
      providers: [TasksService]
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    docsService = module.get<DocsService>(DocsService);
  });

  it('should be defined', () => {
    expect(tasksService).toBeDefined();
  });

  it ('should create a scheduled task', async () => {
    const { format, source } = await setupTestDocs({docsService});
    const scheduled = new Date();
    scheduled.setDate(scheduled.getDate() + 1);
    const task = await tasksService.insertScheduledTask({
      source: source.id,
      format: format.id,
      scheduled: scheduled.toISOString()
    });
    expect(task).toBeTruthy();
    expect(task.constructor.name).toBe('TaskScheduled');
    expect(task).toHaveProperty('id');
  });
  
  it('should save output', async () => {
    const { format, source } = await setupTestDocs({docsService});
    const scheduled = new Date();
    scheduled.setDate(scheduled.getDate() + 1);
    const task = await tasksService.insertScheduledTask({
      source: source.id,
      format: format.id,
      scheduled: scheduled.toISOString()
    });
    const output = await tasksService.insertTaskOutput({
      task: task.id,
      json: { fake: 'data', value: 'whatever' },
    });
    expect(output).toBeTruthy();
    expect(output).toHaveProperty('id');
    expect(output).toHaveProperty('json.fake');
    expect(output.task.id).toEqual(task.id);
  });
  
  fit('should run a task', async () => {
    const { format, source } = await setupTestDocs({
      docsService,
      sourceLocation: staticTestHost,
      formatLocation: '/reed-list.html',
    });
    const scheduled = new Date();
    scheduled.setDate(scheduled.getDate() + 1);
    const task = await tasksService.insertScheduledTask({
      source: source.id,
      format: format.id,
      scheduled: scheduled.toISOString(),
    });
    await tasksService.insertTaskStep({
      task: task.id,
      position: 0,
      agent: 'job',
      skill: 'runJobSkillMatchingAgent',
      filters: [
        {
          name: 'defaultMatchFilterFn',
          criteria: [
            {match: 'true', confidence: 'medium'},
            //{match: 'false', confidence: 'low'}
          ]
        },
      ],
      params: 'javascript, typescript, node'
    });
    await tasksService.insertTaskStep({
      task: task.id,
      position: 0,
      agent: 'job',
      skill: 'runCoverLetterWriterAgent',
      params: cv0
    });
    const runner = new Runner(docsService, tasksService);
    const outputs = await runner.run(task.id);
    expect(outputs).toBeTruthy();
    
    const completedTask = await tasksService.findOne<TaskScheduled>(TaskScheduled, task.id);
    expect(completedTask).toHaveProperty('output');
    expect(completedTask.output).toBeGreaterThanOrEqual(1);
    expect(completedTask.output[0].json).toBeTruthy();
  });
});
