import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Job } from './entities/job.entity';
import { JobInDto } from './dtos/job.in.dto';
import { ClientProxy } from '@nestjs/microservices';
import { JOB_EVENT } from '../../../constants';
import { TaskScheduled } from '../tasks/entities/task-scheduled.entity';
import { add } from 'date-fns';
import { Recurrence } from '../tasks/tasks.types';
import { JobStatus } from '../../../types';

@Injectable()
export class QueueService {

  private readonly logger = new Logger(QueueService.name, {timestamp: true});
  private jobRepository: Repository<Job>

  constructor(
    @InjectDataSource('queue') private readonly dataSource: DataSource,
    @InjectDataSource() private readonly mainDataSource: DataSource,
    @Inject('WORKER_SERVICE') private readonly client: ClientProxy,
  ) {
    this.jobRepository = this.dataSource.getRepository(Job);
  }

  async addJob(data: JobInDto): Promise<Job> {
    const job = new Job();
    job.name = data.name;
    job.task = data.task;
    job.priority = data.priority || 0;
    job.scheduled = data.scheduled || new Date();
    job.status = JobStatus.QUEUED;
    job.created = new Date();
    const saved = await this.jobRepository.save(job);
    this.client.emit(JOB_EVENT.QUEUED, job);
    return saved;
  }

  async fetchNextJob(): Promise<Job | null> {
    const job = await this.jobRepository
      .createQueryBuilder('job')
      .where('job.status = :status', { status: JobStatus.QUEUED })
      .andWhere('job.scheduled <= :now OR job.scheduled IS NULL', { now: new Date() })
      .orderBy('job.priority', 'ASC')
      .addOrderBy('job.created', 'ASC')
      .getOne();

    return job;
  }

  async maybeReschedule(job: Job) {
    const task = await this.mainDataSource.manager.findOneBy(TaskScheduled, {id: job.task});
    if (!task) throw new Error(`Unable to create job — invalid task ID: '${job.task}'`);
    if (!task.interval) return this.deleteJob(job.id);
    const { interval } = task;
    const scheduled = this.calculateScheduledTime(interval, task.scheduled);
    const status = JobStatus.QUEUED;
    await this.jobRepository.update(job.id, {scheduled, status, updated: new Date()});
  }

  calculateScheduledTime(interval: Recurrence, scheduled: string) {
    if (!interval) return scheduled ? new Date(scheduled) : new Date();
    const unit = interval.unit.replace(/^s+$/, '');
    const d = add(new Date(), {[unit]: interval.value});
    return d;
  }

  async updateJobStatus(id: number, status: JobStatus): Promise<UpdateResult> {
    return await this.jobRepository.update(id, { status, updated: new Date() });
  }

  async deleteJob(id: number): Promise<DeleteResult> {
    return await this.jobRepository.delete(id);
  }

  async getJobByTaskId(taskId: number): Promise<Job> {
    return await this.dataSource.manager.findOneBy<Job>(Job, {task: taskId})
  }

  async deleteJobByTaskId(taskId: number): Promise<DeleteResult> {
    const job = await this.dataSource.manager.findOneBy<Job>(Job, {task: taskId})
    if (!job) return;
    return await this.jobRepository.delete(job.id);
  }
  
  async deleteAll(): Promise<any> {
    return await this.dataSource.createQueryBuilder().from(Job, 'job').delete().execute();
  }

  async markAsCompleted(id: number): Promise<UpdateResult> {
    return await this.updateJobStatus(id, JobStatus.COMPLETED);
  }

  async markAsFailed(id: number): Promise<UpdateResult> {
    return await this.updateJobStatus(id, JobStatus.FAILED);
  }

  async fetchJobsByStatus(status: JobStatus): Promise<Job[]> {
    return await this.jobRepository.find({ where: { status } });
  }

  async rescheduleJob(id: number, newScheduledTime: Date): Promise<void> {
    await this.jobRepository.update(id, { scheduled: newScheduledTime, updated: new Date() });
  }
}
