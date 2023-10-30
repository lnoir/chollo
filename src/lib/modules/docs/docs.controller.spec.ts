import { Test, TestingModule } from '@nestjs/testing';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';
import { testTypeOrmImportMain } from '../../../../test/pre-configured.imports';

describe('DocsController', () => {
  let controller: DocsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        testTypeOrmImportMain
      ],
      controllers: [DocsController],
      providers: [DocsService]
    }).compile();

    controller = module.get<DocsController>(DocsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
