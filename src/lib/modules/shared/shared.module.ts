import { Module } from '@nestjs/common';
import { QueryService } from './query/query.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocSource } from '../docs/entities/doc-source.entity';
import { DocFormat } from '../docs/entities/doc-format.entity';
import { DocConfig } from '../docs/entities/doc-config.entity';
import { Doc } from '../docs/entities/doc.entity';
import { TaskScheduled } from '../tasks/entities/task-scheduled.entity';
import { TaskActive } from '../tasks/entities/task-active.entity';
import { TaskLogged } from '../tasks/entities/task-logged.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DocSource, DocFormat, DocConfig, Doc, TaskScheduled, TaskActive, TaskLogged
    ]),
  ],
  providers: [QueryService],
  exports: [QueryService]
})
export class SharedModule {}
