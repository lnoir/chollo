import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DocFormat } from './doc-format.entity';

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

  @Column()
  created: string;
  
  @Column({nullable: true})
  updated: string;
  
  @Column({nullable: true})
  deleted: string;
}
