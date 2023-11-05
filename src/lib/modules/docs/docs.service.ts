import { Injectable } from '@nestjs/common';
import { Doc } from './entities/doc.entity';
import { DataSource, DeleteResult, UpdateResult } from 'typeorm';
import { DocSource } from './entities/doc-source.entity';
import { DocFormat } from './entities/doc-format.entity';
import { DocConfig } from './entities/doc-config.entity';
import { QueryService } from '../shared/query/query.service';
import { DocSourceDto } from './dtos/doc-source.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DocFormatInDto } from './dtos/doc-format.in.dto';
import { DocConfigInDto } from './dtos/doc-config.in.dto';

@Injectable()
export class DocsService extends QueryService {
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
  
  async insertDocConfig(data: DocConfigInDto): Promise<any> {
    const formatId = data.format;
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

  private updateDoc(key: number | string, data: any): Promise<UpdateResult> {
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

  updateDocSource(id: number, data: DocSourceDto): Promise<UpdateResult> {
    return this.updateDoc(id, data);
  }

  async deleteDocSource(id: number): Promise<DeleteResult> {
    const source = await this.getDocSource(id);
    if (!source) return;
    if (source.formats?.length) throw new Error('Source contains data');
    return this.dataSource.manager.delete(DocSource, id);
  }

  /* Formats */
  async insertDocFormat(data: DocFormatInDto): Promise<DocFormat> {
    const source = await this.getDocSource(data.source);
    if (!source) throw new Error(`Invalid source: '${data.source}`);
    const shell = new DocFormat();
    const docFormat = this.objectToEntity<DocFormat>(shell, data);
    docFormat.source = source;
    docFormat.created = new Date().toISOString();
    return this.save<DocFormat>(docFormat);
  }

  getDocFormat(id: number): Promise<DocFormat> {
    return this.findOne<DocFormat>(DocFormat, id);
  }

  updateFormat(format: DocFormatInDto) {
    return this.dataSource.manager.save(format);
  }

  async deleteDocFormat(id: number): Promise<DeleteResult> {
    const format = await this.getDocFormat(id);
    if (!format) return;
    return this.dataSource.manager.delete(DocFormat, id);
  }
  /* /Formats */

  getDocConfig(id: number): Promise<DocConfig> {
    return this.dataSource.manager.findOneBy(DocConfig, {id});
  }

  getDocs(): Promise<Doc[]> {
    return this.dataSource.manager.find(Doc);
  }

  getDocBy(column: string, value: number | string): Promise<Doc | null> {
    return this.dataSource.manager.findOneBy(Doc, {[column]: value});
  }

  async removeDocConfig(id: number): Promise<DeleteResult> {
    return await this.remove(DocConfig, { id });
  }

  async removeDoc(id: number): Promise<DeleteResult> {
    return await this.remove(Doc, { id });
  }
}
