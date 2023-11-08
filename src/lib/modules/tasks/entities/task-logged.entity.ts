import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class TaskLogged {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  task: number;

  @Column()
  job: number;
  
  @Column()
  source: string;

  @Column()
  format: string;
  
  @Column({enum: ['completed','cancelled','failed']})
  status: string;

  @Column({nullable: true})
  message: string;

  @Column({type: 'datetime'})
  start: string;

  @Column({type: 'datetime'})
  end: string;
}
