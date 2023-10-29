import { Test, TestingModule } from '@nestjs/testing';
import { Runner } from './runner';

describe('Runner', () => {
  let service: Runner;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Runner],
    }).compile();

    service = module.get<Runner>(Runner);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
