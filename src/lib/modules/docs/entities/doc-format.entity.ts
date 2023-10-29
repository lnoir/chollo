import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, Index } from 'typeorm';
import { DocSource } from './doc-source.entity';
import { DocConfig } from './doc-config.entity';

@Entity()
export class DocFormat {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({enum: ['html', 'json', 'xml', 'text']})
  type: string;

  @Column()
  name: string;

  @Column()
  location: string;
  
  @ManyToOne(() => DocSource, (doc_source) => doc_source.formats)
  source: DocSource;

  @OneToOne(() => DocConfig, (config) => config.format, {eager: true})
  @JoinColumn()
  config: DocConfig;

  @Column()
  created: string;
  
  @Column({nullable: true})
  updated: string;
  
  @Column({nullable: true})
  deleted: string;
}
