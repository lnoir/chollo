import { Test, TestingModule } from '@nestjs/testing';
import { DocsService } from './docs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doc } from './entities/doc.entity';
import { DocSource } from './entities/doc-source.entity';
import { DocFormat } from './entities/doc-format.entity';
import { DocConfig } from './entities/doc-config.entity';
import { testTypeOrmImportMain } from '../../../../test/pre-configured.imports';
import { SharedModule } from '../shared/shared.module';

describe('DocsService', () => {
  let service: DocsService;
  let testRun: number;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        testTypeOrmImportMain,
        SharedModule
      ],
      providers: [DocsService],
      controllers: [],
      exports: [TypeOrmModule]
    }).compile();

    service = module.get<DocsService>(DocsService);
    testRun = Date.now();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert a doc source', async () => {
    const data = {
      name: `Test Source ${testRun}.${Math.random()}`,
      type: 'web',
      location: 'http://dummysite.com'
    }
    const res = await service.insertDocSource(data);
    expect(res).toBeTruthy();

    const docSource = await service.getDocSource(res[0]);
    expect(docSource.name).toBe(data.name);
  });
  
  it('should prevent insertion of a doc with invalid `type` value', async () => {
    const data = {
      name: `Test Source ${testRun}.${Math.random()}`,
      type: 'game',
      location: 'http://dummysite.com'
    };
    expect(service.insertDocSource(data)).rejects.toThrow();
  });

  it('should insert a source and a format', async () => {
    const testId = Math.random();
    const docData = {
      name: `Test Source ${testRun}.${testId}`,
      type: 'web',
      location: 'http://dummysite.com'   
    };
    const docInsertRes = await service.insertDocSource(docData);
    const docSource = await service.getDocSource(docInsertRes[0]);
    const formatData = {
      type: 'html',
      name: `List Page ${testRun}.${testId}`,
      location: 'http://dummysite.com/items',
      source: docSource.id,
    };
    const docFormatRes = await service.insertDocFormat(docSource.id, formatData);
    const docFormat = await service.getDocFormat(docFormatRes[0]);
    expect(docFormat.name).toBe(formatData.name);
    const updatedDocSource = await service.getDocSource(docSource.id);
    expect(updatedDocSource.formats).toHaveLength(1);
  });

  it('should insert a source, format and config', async () => {
    const testId = Math.random();
    const docData = {
      name: `Test Source ${testRun}.${testId}`,
      type: 'web',
      location: 'http://dummysite.com'   
    };
    const docInsertRes = await service.insertDocSource(docData);
    const docSource = await service.getDocSource(docInsertRes[0]);
    const formatData = {
      type: 'html',
      name: `List Page ${testRun}.${testId}`,
      location: 'http://dummysite.com/items',
      source: docSource.id,
    };
    const docFormatRes = await service.insertDocFormat(docSource.id, formatData);
    const docFormat = await service.getDocFormat(docFormatRes[0]);
    const configData = {
      selector_type: 'element',
      selector: 'article',
      map: [
        {title: 'header h2'},
        {content: '.card-body'},
        {source: 'h2 a'}
      ],
      js: false
    };
    const configRes = await service.insertDocConfig(docFormat.id, configData);
    const docConfig = await service.getDocConfig(configRes[0]);
    docFormat.config = docConfig;
    await service.updateFormat(docFormat);
    const withConfig = await service.getDocFormat(docFormat.id);
    expect(withConfig).toHaveProperty('config.id', 1);
  }); 
});
