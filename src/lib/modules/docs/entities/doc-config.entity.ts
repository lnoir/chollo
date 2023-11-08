import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { DocFormat } from './doc-format.entity';

@Entity()
export class DocConfig {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({enum: ['element', 'pattern'], nullable: true})
  selector_type: string;

  @Column({nullable: true})
  selector: string;

  @Column({nullable: true, type: "json"})
  map: Record<string, any>[];

  @Column()
  js: boolean;

  @OneToOne(() => DocFormat, (format) => format.config)
  format: DocFormat;

  @Column()
  created: string;
  
  @Column({nullable: true})
  updated: string;
  
  @Column({nullable: true})
  deleted: string;
}
