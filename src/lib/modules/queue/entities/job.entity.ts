import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

export enum JobStatus {
  QUEUED = 'queued',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity()
export class Job {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ type: Number, nullable: false})
    @Index()
    task: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: Boolean, default: false })
    recurring: boolean;

    @Column({ type: String, nullable: true })
    interval: string; // date-fns-parseable relative string

    //@Column({ type: 'string', nullable: true })
    //pattern: string | null;

    @Column({ type: Number })
    priority: number;

    @Column({ type: Number, default: false })
    status: JobStatus;

    @Column({ type: 'datetime', nullable: true })
    scheduled: Date | null;

    @Column({ type: 'datetime', nullable: true })
    created: Date | null;

    @Column({ type: 'datetime', nullable: true })
    updated: Date | null;
}