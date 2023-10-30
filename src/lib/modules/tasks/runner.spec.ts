import { Test, TestingModule } from '@nestjs/testing';
import { RunnerFactory } from './runner';
import { SharedModule } from '../shared/shared.module';
import { DocsModule } from '../docs/docs.module';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mainEntities } from '../../../../test/helpers';
import { Job } from '../queue/entities/job.entity';
import { testTypeOrmImportMain, testTypeOrmImportQueue } from '../../../../test/pre-configured.imports';

describe('Runner', () => {
  let factory: RunnerFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        testTypeOrmImportMain,
        testTypeOrmImportQueue,
        DocsModule,
        SharedModule,
        DocsModule,
      ],
      providers: [TasksService, RunnerFactory],
    }).compile();

    factory = module.get<RunnerFactory>(RunnerFactory);
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });
});
