import { Test, TestingModule } from '@nestjs/testing';
import { QueryService } from './query.service';
import { mainEntities } from '../../../../../test/helpers';
import { SharedModule } from '../shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('QueryService', () => {
  let service: QueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: mainEntities,
          synchronize: true,
        }),
        SharedModule
      ],
      providers: [QueryService],
    }).compile();

    service = module.get<QueryService>(QueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
