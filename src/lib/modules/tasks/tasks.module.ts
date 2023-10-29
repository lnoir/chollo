import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskScheduled } from './entities/task-scheduled.entity';
import { TaskActive } from './entities/task-active.entity';
import { SharedModule } from '../shared/shared.module';
import { DocsModule } from '../docs/docs.module';
import { TaskLogged } from './entities/task-logged.entity';
import { TaskOutput } from './entities/task-output.entity';
import { Runner } from './runner';
import { TaskStep } from './entities/task-step.entity';

@Module({
  imports: [
    SharedModule,
    DocsModule,
    TypeOrmModule.forFeature([
      TaskScheduled, TaskActive, TaskStep, TaskLogged, TaskOutput
    ])
  ],
  providers: [TasksService, Runner],
  controllers: [TasksController],
})
export class TasksModule {}
