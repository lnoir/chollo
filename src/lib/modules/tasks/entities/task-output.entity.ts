import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { TaskScheduled } from './task-scheduled.entity';

@Entity()
export class TaskOutput {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TaskScheduled, (task) => task.output)
  @JoinColumn()
  task: TaskScheduled;
  
  @Column()
  agent: string;

  @Column()
  skill: string;
  
  @Column({type: 'text', nullable: true})
  text: any;

  @Column({type: 'json', nullable: true})
  json: any;

  @Column()
  created: string;
  
  @Column({nullable: true})
  deleted: string;
}
