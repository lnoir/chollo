import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Doc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  key: string;

  @Column({type: 'json'})
  data: string;

  @Column()
  type: string;

  @Column()
  created: string;
  
  @Column({nullable: true})
  updated: string;
  
  @Column({nullable: true})
  deleted: string;
}
