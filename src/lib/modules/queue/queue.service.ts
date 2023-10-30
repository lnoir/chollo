import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Job, JobStatus } from './entities/job.entity';
import { JobInDto } from './dtos/job.in.dto';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { JOB_EVENT } from '../../../constants';

const t = 60;

@Injectable()
export class QueueService {

  private readonly logger = new Logger(QueueService.name, {timestamp: true});
  private jobRepository: Repository<Job>

  constructor(
    @InjectDataSource('queue') private readonly dataSource: DataSource,
    @Inject('WORKER_SERVICE') private readonly client: ClientProxy,
  ) {
    this.jobRepository = this.dataSource.getRepository(Job);
  }

  async addJob(data: JobInDto): Promise<Job> {
    const job = new Job();
    job.name = data.name;
    job.task = data.task;
    job.priority = data.priority || 0;
    job.scheduled = data.scheduled;
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

  async updateJobStatus(id: string, status: JobStatus): Promise<UpdateResult> {
    return await this.jobRepository.update(id, { status, updated: new Date() });
  }

  async deleteJob(id: string): Promise<DeleteResult> {
    return await this.jobRepository.delete(id);
  }
  
  async deleteAll(): Promise<any> {
    return await this.dataSource.createQueryBuilder().from(Job, 'job').delete().execute();
  }

  async markAsCompleted(id: string): Promise<UpdateResult> {
    return await this.updateJobStatus(id, JobStatus.COMPLETED);
  }

  async markAsFailed(id: string): Promise<UpdateResult> {
    return await this.updateJobStatus(id, JobStatus.FAILED);
  }

  async fetchJobsByStatus(status: JobStatus): Promise<Job[]> {
    return await this.jobRepository.find({ where: { status } });
  }

  async rescheduleJob(id: string, newScheduledTime: Date): Promise<void> {
    await this.jobRepository.update(id, { scheduled: newScheduledTime, updated: new Date() });
  }
}
