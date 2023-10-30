import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { SharedModule } from '../shared/shared.module';
import { DocsModule } from '../docs/docs.module';
import { RunnerFactory } from './runner';

@Module({
  imports: [
    SharedModule,
    DocsModule,
  ],
  providers: [TasksService, RunnerFactory],
  controllers: [TasksController],
  exports: [RunnerFactory]
})
export class TasksModule {}
