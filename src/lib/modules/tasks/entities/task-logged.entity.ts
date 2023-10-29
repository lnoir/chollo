import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class TaskLogged {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  source: string;

  @Column()
  format: string;

  @Column({type: 'datetime'})
  scheduled: string;
  
  @Column({enum: ['completed','cancelled','failed']})
  status: string;

  @Column({type: 'datetime'})
  start: string;

  @Column({type: 'datetime'})
  end: string;
}
