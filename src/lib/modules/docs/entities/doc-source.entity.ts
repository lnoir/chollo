import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DocFormat } from './doc-format.entity';
import { TaskScheduled } from '../../tasks/entities/task-scheduled.entity';

@Entity()
export class DocSource {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({enum: ['web', 'drive', 'text']})
  type: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @OneToMany(() => DocFormat, (docFormat) => docFormat.source, {eager: true})
  formats: DocFormat[]

  @OneToMany(() => TaskScheduled,  (taskScheduled) => {taskScheduled.source})
  tasks: TaskScheduled[];

  @Column()
  created: string;
  
  @Column({nullable: true})
  updated: string;
  
  @Column({nullable: true})
  deleted: string;
}
