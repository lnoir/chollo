import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doc } from './lib/modules/docs/entities/doc.entity';
import { DocsModule } from './lib/modules/docs/docs.module';
import { DocsService } from './lib/modules/docs/docs.service';
import { TasksModule } from './lib/modules/tasks/tasks.module';
import { SharedModule } from './lib/modules/shared/shared.module';
import { DocSource } from './lib/modules/docs/entities/doc-source.entity';
import { DocFormat } from './lib/modules/docs/entities/doc-format.entity';
import { DocConfig } from './lib/modules/docs/entities/doc-config.entity';
import { TaskScheduled } from './lib/modules/tasks/entities/task-scheduled.entity';
import { TaskActive } from './lib/modules/tasks/entities/task-active.entity';
import { TaskLogged } from './lib/modules/tasks/entities/task-logged.entity';
import { TaskOutput } from './lib/modules/tasks/entities/task-output.entity';
import { TaskStep } from './lib/modules/tasks/entities/task-step.entity';
import { QueueModule } from './lib/modules/queue/queue.module';
import { Job } from './lib/modules/queue/entities/job.entity';
import { ClientsModule } from '@nestjs/microservices';

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
    DocsModule,
    TasksModule,
    SharedModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService, DocsService, ClientsModule],
})
export class AppModule {}
