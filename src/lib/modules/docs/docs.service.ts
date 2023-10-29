import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Doc } from './entities/doc.entity';
import { DataSource, DeleteResult, EntityTarget, ObjectLiteral, UpdateResult } from 'typeorm';
import { DocSource } from './entities/doc-source.entity';
import { DocFormat } from './entities/doc-format.entity';
import { DocConfig } from './entities/doc-config.entity';
import { QueryService } from '../shared/query/query.service';
import { DocFormatDto } from './dtos/doc-format.dto';
import { DocSourceDto } from './dtos/doc-source.dto';
import { DocConfigDto } from './dtos/doc-config.dto';

@Injectable()
export class DocsService extends QueryService{
  constructor(
    @InjectDataSource() protected readonly dataSource: DataSource,
  ) {
    super(dataSource)
  }

  insertDocSource(data: DocSourceDto): Promise<DocSource> {
    const docSource = new DocSource();
    const { name, type, location } = data;
    docSource.name = name;
    docSource.type = type;
    docSource.location = location;
    docSource.created = new Date().toISOString();
    return this.save(docSource);
  }

  async insertDocFormat(sourceId: number, data: DocFormatDto): Promise<DocFormat> {
    const source = await this.getDocSource(sourceId);
    const shell = new DocFormat();
    const docFormat = this.objectToEntity<DocFormat>(shell, data);
    docFormat.source = source;
    docFormat.created = new Date().toISOString();
    return this.save<DocFormat>(docFormat);
  }
  
  async insertDocConfig(formatId: number, data: DocConfigDto): Promise<any> {
    const format = await this.getDocFormat(formatId);
    const shell = new DocConfig();
    const docConfig = this.objectToEntity<DocConfig>(shell, data);
    docConfig.format = format;
    docConfig.created = new Date().toISOString();
    return this.save<DocConfig>(docConfig);
  }

  insertDoc(data: any): Promise<number[]> {
    return this.insert(
      Doc,
      [{...data, created: new Date().toISOString()}],
      ['data']
    );
  }

  updateDoc(key: string, data: any): Promise<UpdateResult> {
    return this.dataSource
    .createQueryBuilder()
    .update(Doc)
    .set({ data, updated: new Date().toISOString() })
    .where("key = :key", { key })
    .execute();
  }

  getDocSources(): Promise<DocSource[]> {
    return this.dataSource.manager.find<DocSource>(DocSource);
  }

  getDocSource(id: number): Promise<DocSource> {
    return this.dataSource.manager.findOneBy(DocSource, {id});
  }

  getDocFormat(id: number): Promise<DocFormat> {
    return this.findOne<DocFormat>(DocFormat, id);
  }

  getDocConfig(id: number): Promise<DocConfig> {
    return this.dataSource.manager.findOneBy(DocConfig, {id});
  }

  getDocs(): Promise<Doc[]> {
    return this.dataSource.manager.find(Doc);
  }

  getDocBy(column: string, value: number | string): Promise<Doc | null> {
    return this.dataSource.manager.findOneBy(Doc, {[column]: value});
  }

  updateFormat(format: DocFormat) {
    return this.dataSource.manager.save(format);
  }

  async removeDocConfig(id: number): Promise<DeleteResult> {
    return await this.remove(DocConfig, { id });
  }

  async removeDoc(id: number): Promise<DeleteResult> {
    return await this.remove(Doc, { id });
  }
}
