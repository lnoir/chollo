import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { SharedModule } from '../shared/shared.module';
import { DocsModule } from '../docs/docs.module';
import { RunnerFactory } from './runner';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    SharedModule,
    DocsModule,
    QueueModule,
  ],
  providers: [TasksService, RunnerFactory],
  controllers: [TasksController],
  exports: [RunnerFactory, TasksService]
})
export class TasksModule {}
