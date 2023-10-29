import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Job, JobStatus } from './entities/job.entity';
import { JobInDto } from './dtos/job.in.dto';
import { ClientProxy } from '@nestjs/microservices';

const t = 60;

@Injectable()
export class QueueService implements OnModuleInit {

  private readonly logger = new Logger(QueueService.name, {timestamp: true});
  private jobRepository: Repository<Job>

  constructor(
    @InjectDataSource('queue') private readonly dataSource: DataSource,
    @Inject('WORKER_SERVICE') private readonly client: ClientProxy,
  ) {
    this.jobRepository = this.dataSource.getRepository(Job);
  }

  // Lifecycle hook for module initialization
  async onModuleInit() {
    if (process.env.CHOLLO_SERVICE === 'worker') return; 
    // Set an interval to check for jobs
    setInterval(async () => {
      const job = await this.fetchNextJob();
      if (job) {
        this.logger.debug({job});
      }
    }, t * 1000);  // Check every `x` seconds
  }

  // Add a new job to the queue
  async addJob(data: JobInDto): Promise<Job> {
    const job = new Job();
    job.name = data.name;
    job.task = data.task;
    job.priority = data.priority || 0;
    job.scheduled = data.scheduled;
    job.status = JobStatus.QUEUED;
    job.created = new Date();
    const saved = await this.jobRepository.save(job);
    this.client.emit('job_created', job);
    return saved;
  }

  // Fetch next job to be executed based on priority and time
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

  async updateJobStatus(id: string, status: JobStatus): Promise<void> {
    await this.jobRepository.update(id, { status, updated: new Date() });
  }

  async deleteJob(id: string): Promise<void> {
    await this.jobRepository.delete(id);
  }

  async markAsCompleted(id: string): Promise<void> {
    await this.updateJobStatus(id, JobStatus.COMPLETED);
  }

  async markAsFailed(id: string): Promise<void> {
    await this.updateJobStatus(id, JobStatus.FAILED);
  }

  async fetchJobsByStatus(status: JobStatus): Promise<Job[]> {
    return await this.jobRepository.find({ where: { status } });
  }

  async rescheduleJob(id: string, newScheduledTime: Date): Promise<void> {
    await this.jobRepository.update(id, { scheduled: newScheduledTime, updated: new Date() });
  }

}
