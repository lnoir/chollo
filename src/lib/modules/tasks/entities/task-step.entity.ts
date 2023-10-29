import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, Index, ManyToOne } from 'typeorm';
import { TaskScheduled } from './task-scheduled.entity';

@Entity()
@Index(['task', 'position'])
export class TaskStep {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TaskScheduled, (task) => task.steps)
  @JoinColumn()
  task: TaskScheduled;

  @Column({default: 0, type: Number})
  position: number;
 
  @Column()
  agent: string;

  @Column()
  skill: string;

  @Column({nullable: true})
  params: string;

  @Column({nullable: true, type: 'json'})
  filters: object[];

  @Column()
  created: string;
  
  @Column({nullable: true})
  updated: string;
  
  @Column({nullable: true})
  deleted: string;
}
