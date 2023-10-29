import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { TaskScheduled } from './task-scheduled.entity';

@Entity()
export class TaskActive {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TaskScheduled)
  @JoinColumn()
  task: string;

  @Column()
  created: string;
  
  @Column({nullable: true})
  updated: string;
  
  @Column({nullable: true})
  deleted: string;
}
