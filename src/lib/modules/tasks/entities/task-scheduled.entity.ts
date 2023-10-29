import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { DocSource } from '../../docs/entities/doc-source.entity';
import { DocFormat } from '../../docs/entities/doc-format.entity';
import { TaskOutput } from './task-output.entity';
import { TaskStep } from './task-step.entity';

@Entity()
export class TaskScheduled {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => DocSource, {eager: true})
  @JoinColumn()
  source: DocSource;

  @OneToOne(() => DocFormat, {eager: true})
  @JoinColumn()
  format: DocFormat;

  @Column({nullable: true})
  params: string;

  @OneToMany(() => TaskStep, step => step.task, {eager: true})
  steps: TaskStep[];

  @Column({type: 'datetime'})
  scheduled: string;

  @OneToMany(() => TaskOutput, output => output.task, {nullable: true, eager: true})
  output: TaskOutput[];

  @Column()
  created: string;
  
  @Column({nullable: true})
  updated: string;
  
  @Column({nullable: true})
  deleted: string;
}
