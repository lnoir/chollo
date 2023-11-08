import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Job } from '../queue/entities/job.entity';
import { QueueService } from '../queue/queue.service';
import { ConfigService } from '@nestjs/config';
import { RunnerFactory } from '../tasks/runner';
import { JOB_EVENT, MAIN_SERVICE, WORKER_SERVICE } from '../../../constants';
import { JobStatus } from '../../../types';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class WorkerService implements OnModuleInit {

  private t: number;
  private readonly logger = new Logger(WorkerService.name);

  private concurrency = 1;

  constructor(
    @Inject(MAIN_SERVICE) private readonly mainService: ClientProxy,
    private readonly runnerFactory: RunnerFactory,
    private readonly queueService: QueueService,
    private readonly tasksService: TasksService,
    readonly config: ConfigService
  ) {
    this.t = config.get('queueCheckIntervalSeconds') || 300;
  }

  async onModuleInit() {
    if (process.env.CHOLLO_SERVICE !== WORKER_SERVICE) return; 
    // Check queue every `t` seconds
    setInterval(async () => {
      await this.checkForNextJob();
    }, this.t * 1000);
  }

  async checkForNextJob() {
    const inProgress:Job[] = await this.queueService.fetchJobsByStatus(JobStatus.IN_PROGRESS);
    // For now, run one task at a time.
    if (inProgress?.length >= this.concurrency) {
      this.logger.log(`Jobs in progress: ${inProgress.map(j => j.id).join(', ')}`);
      return;
    }

    const job = await this.queueService.fetchNextJob();
    if (job) {
      this.logger.debug({job});
      const runner = this.runnerFactory.getNewRunner();
      let start: Date;
      let status: JobStatus;
      let errMessage = '';
      try {
        await this.queueService.updateJobStatus(job.id, JobStatus.IN_PROGRESS);
        this.mainService.emit(JOB_EVENT.IN_PROGRESS, job);
        start = new Date();
        await runner.run(job);
        await this.queueService.maybeReschedule(job);
        status = JobStatus.COMPLETED;
      }
      catch(err) {
        errMessage = err.message;
        this.logger.error(err);
        this.logger.debug(err);
        const { message } = err;
        this.mainService.emit(JOB_EVENT.FAILED, {message, job});
        status = JobStatus.FAILED;
      }
      try {
        const end = new Date();
        if (status === JobStatus.FAILED) {
          // Removed from queue until restored by a human
          await this.queueService.deleteJob(job.id);
        }
        await this.tasksService.insertLoggedTask(job.task, {start, end, status, message: errMessage, job: job.id});
        this.mainService.emit(`job_${status}`, job); 
      }
      catch(err) {
        this.logger.debug(err);
        this.logger.error(`Catastrophic failure! ${err.message}`, '@Worker');
      }
    }
  }
}
