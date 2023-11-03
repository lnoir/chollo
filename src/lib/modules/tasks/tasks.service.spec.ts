import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { setupTestDocs, staticTestHost } from '../../../../test/helpers';
import { DocsService } from '../docs/docs.service';
import { SharedModule } from '../shared/shared.module';
import { TaskScheduled } from './entities/task-scheduled.entity';
import { DocsModule } from '../docs/docs.module';
import { RunnerFactory } from './runner';
import { cv0 } from '../../../../test/cvs/cv0';
import { testTypeOrmImportMain } from '../../../../test/pre-configured.imports';

jest.setTimeout(240000);

describe('TasksService', () => {
  let tasksService: TasksService;
  let docsService: DocsService;
  let runnerFactory: RunnerFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SharedModule,
        testTypeOrmImportMain,
        DocsModule,
      ],
      providers: [TasksService, RunnerFactory]
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    docsService = module.get<DocsService>(DocsService);
    runnerFactory = module.get<RunnerFactory>(RunnerFactory);
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
    const runner = runnerFactory.getNewRunner();
    const outputs = await runner.run(task.id);
    expect(outputs).toBeTruthy();
    
    const completedTask = await tasksService.findOne<TaskScheduled>(TaskScheduled, task.id);
    expect(completedTask).toHaveProperty('output');
    expect(completedTask.output).toBeGreaterThanOrEqual(1);
    expect(completedTask.output[0].json).toBeTruthy();
  });
});
