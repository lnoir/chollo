import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToOne } from 'typeorm';
import { DocSource } from '../../docs/entities/doc-source.entity';
import { DocFormat } from '../../docs/entities/doc-format.entity';
import { TaskOutput } from './task-output.entity';
import { TaskStep } from './task-step.entity';

@Entity()
export class TaskScheduled {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DocSource, (source) => source.tasks, {eager: true})
  @JoinColumn()
  source: DocSource;

  @ManyToOne(() => DocFormat, (format) => format.tasks, {eager: true})
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
