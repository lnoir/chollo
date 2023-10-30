import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { Job, JobStatus } from '../queue/entities/job.entity';
import { QueueService } from '../queue/queue.service';
import { ConfigService } from '@nestjs/config';
import { RunnerFactory } from '../tasks/runner';
import { JOB_EVENT, MAIN_SERVICE, WORKER_SERVICE } from '../../../constants';

@Injectable()
export class WorkerService implements OnModuleInit {

  private t: number;
  private readonly logger = new Logger(WorkerService.name);

  private concurrency = 1;

  constructor(
    @Inject(MAIN_SERVICE) private readonly mainService: ClientProxy,
    private readonly runnerFactory: RunnerFactory,
    private readonly queueService: QueueService,
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
      this.logger.debug({job}, '@job');
      const runner = this.runnerFactory.getNewRunner();
      try {
        await runner.run(job.task);
        this.mainService.emit(JOB_EVENT.COMPLETED, job);
        this.queueService.markAsCompleted(job.id);
      }
      catch(err) {
        const { message } = err;
        this.mainService.emit(JOB_EVENT.FAILED, {message, job});
      }
    }
  }
}
