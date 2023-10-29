import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocSource } from '../docs/entities/doc-source.entity';
import { DocFormat } from '../docs/entities/doc-format.entity';
import { DocConfig } from '../docs/entities/doc-config.entity';
import { Doc } from '../docs/entities/doc.entity';
import { TaskScheduled } from '../tasks/entities/task-scheduled.entity';
import { TaskActive } from '../tasks/entities/task-active.entity';
import { TaskLogged } from '../tasks/entities/task-logged.entity';
import { Job } from '../queue/entities/job.entity';
import { TasksModule } from '../tasks/tasks.module';
import { TaskStep } from '../tasks/entities/task-step.entity';
import { TaskOutput } from '../tasks/entities/task-output.entity';
import { ConfigModule } from '@nestjs/config';
import { WorkerController } from './worker.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'chollo.db',
      entities: [
        DocSource, DocFormat, DocConfig, Doc, TaskScheduled, TaskStep, TaskActive, TaskLogged, TaskOutput
      ],
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      name: 'queue',
      type: 'sqlite',
      database: 'cholloq.db',
      entities: [
        Job
      ],
      synchronize: true,
    }),
    TasksModule
  ],
  providers: [WorkerService],
  controllers: [WorkerController]
})
export class WorkerModule {}
