import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { JobStatus } from '../../../../types';

@Entity()
export class Job {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ type: Number, nullable: false})
    @Index()
    task: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: Number })
    priority: number;

    @Column({ type: Number, default: 'queued' })
    status: JobStatus;

    @Column({ type: 'datetime' })
    scheduled: Date;

    @Column({ type: 'datetime'})
    created: Date;

    @Column({ type: 'datetime', nullable: true})
    updated: Date;
}