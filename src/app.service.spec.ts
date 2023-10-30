import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { testTypeOrmImportMain } from '../test/pre-configured.imports';


// @TODO: serve local versions of the pages we're testing against.

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        testTypeOrmImportMain
      ],
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  it('should be createdt', async () => {
    expect(appService).toBeTruthy();
  });
});
