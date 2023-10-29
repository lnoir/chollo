import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeleteResult, EntityTarget, FindManyOptions, ObjectLiteral, UpdateResult } from 'typeorm';
import { QueryService } from '../shared/query/query.service';
import { TaskScheduled } from './entities/task-scheduled.entity';
import { TaskActive } from './entities/task-active.entity';
import { TaskLogged } from './entities/task-logged.entity';
import { TaskScheduledInDto } from './dtos/task-scheduled.in.dto';
import { DocsService } from '../docs/docs.service';
import { TaskOutputInDto } from './dtos/task-output.in.dto';
import { TaskOutput } from './entities/task-output.entity';
import { TaskStepInDto } from './dtos/task-step.in.dto';
import { TaskStep } from './entities/task-step.entity';

@Injectable()
export class TasksService extends QueryService {
  constructor(
    @InjectDataSource() protected readonly dataSource: DataSource,
    private readonly docsService: DocsService
  ) {
    super(dataSource)
  }

  async insertScheduledTask(data: TaskScheduledInDto): Promise<TaskScheduled> {
    const source = await this.docsService.getDocSource(data.source);
    const format = await this.docsService.getDocFormat(data.format);
    const task = new TaskScheduled();
    task.source = source;
    task.format = format;
    task.params = data.params;
    task.scheduled = data.scheduled;
    task.created = this.getNow();
    return this.save<TaskScheduled>(task);
  }

  async insertTaskStep(data: TaskStepInDto): Promise<TaskStep> {
    const task = await this.findOne<TaskScheduled>(TaskScheduled, data.task);
    const step = new TaskStep();
    step.position = data.position;
    step.agent = data.agent;
    step.skill = data.skill;
    step.params = data.params;
    step.filters = data.filters;
    step.task = task;
    step.created = this.getNow();
    return this.save<TaskStep>(step);
  }

  async insertTaskOutput(data: TaskOutputInDto): Promise<TaskOutput> {
    const task = await this.findOne<TaskScheduled>(TaskScheduled, data.task);
    const output = new TaskOutput();
    output.text = data.text;
    output.json = data.json;
    output.agent = data.agent;
    output.skill = data.skill;
    output.task = task;
    output.created = this.getNow();
    return this.save<TaskOutput>(output);
  }

  findScheduledTasks(opts?: FindManyOptions): Promise<TaskScheduled[]> {
    return this.dataSource.manager.find(TaskScheduled, opts)
  }

  updateScheduledTask(data: any): Promise<UpdateResult> {
    return this.dataSource.manager.save(data);
  }

  removeScheduledTask(id: number): Promise<DeleteResult> {
    return this.remove(TaskScheduled, { id });
  }
  
  insertActiveTask(data: any): Promise<number[]> {
    return this.insert(
      TaskActive,
      [{...data, created: new Date().toISOString()}]
    );
  }

  async findActiveTask(scheduledTaskId: number): Promise<TaskActive> {
    return await this.findOneBy<TaskActive>(TaskActive, {task: scheduledTaskId});
  }

  removeActiveTask(id: number): Promise<DeleteResult> {
    return this.remove(TaskActive, { id });
  }

  insertLoggedTask(data: any): Promise<number[]> {
    return this.insert(
      TaskLogged,
      [{...data}]
    );
  }

  findLoggedTasks(opts?: FindManyOptions): Promise<TaskLogged[]> {
    return this.dataSource.manager.find(TaskLogged, opts)
  }
}
