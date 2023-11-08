import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeleteResult, EntityTarget, ObjectLiteral, UpdateResult } from 'typeorm';

@Injectable()
export class QueryService {
  constructor(
    @InjectDataSource() protected readonly dataSource: DataSource,
  ) {}

  protected async insert(
    entity: EntityTarget<ObjectLiteral>,
    data,
    upsert?: string[]
  ): Promise<number[]> {
    const values = Array.isArray(data) ? data : [data];
    const stmt = this.dataSource
    .createQueryBuilder()
    .insert()
    .into(entity)
    .values(values);

    if (upsert) {
      stmt.orUpdate(upsert);
    }

    const res = await stmt.execute();
    return res.identifiers.map(data => data.id);
  }

  async updateBy(
    entity: EntityTarget<ObjectLiteral>,
    data: any,
    criteria: any
  ): Promise<UpdateResult> {
    console.log(criteria, data)
    const stmt = await this.dataSource.manager
    .update(entity, criteria, data);
    return stmt;
  }

  async remove(
    entity: EntityTarget<ObjectLiteral>,
    criteria: any
  ): Promise<DeleteResult> {
    const stmt = await this.dataSource.manager
    .delete(entity, criteria);
    return stmt;
  }

  getNow() {
    return new Date().toISOString();
  }

  objectToEntity<T>(entity: any, data: any): T {
    for (const k of Object.keys(data)) {
      entity[k] = data[k];
    };
    return entity;
  }

  async save<Entity>(entity: Entity): Promise<Entity> {
    return this.dataSource.manager.save(entity);
  }

  async findOne<T>(entity: EntityTarget<ObjectLiteral>, id: number) {
    return this.dataSource.manager.findOneBy(entity, { id }) as T;
  }
  
  async findOneBy<T>(entity: EntityTarget<ObjectLiteral>, criteria: any): Promise<T> {
    return this.dataSource.manager.findOneBy(entity, criteria) as T;
  }

  async findBy(entity: EntityTarget<ObjectLiteral>, criteria?: any) {
    return this.dataSource.manager.findBy(entity, criteria);
  }
}
