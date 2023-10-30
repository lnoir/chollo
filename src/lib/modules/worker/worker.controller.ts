import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Job } from '../queue/entities/job.entity';
import { JOB_EVENT } from '../../../constants';
import { WorkerService } from './worker.service';

@Controller('worker')
export class WorkerController {

  private readonly logger = new Logger(WorkerController.name);

  constructor(
    private readonly workerService: WorkerService
  ) {}

@EventPattern(JOB_EVENT.QUEUED)
  async handleJobQueuedEvent(@Payload() data: Job): Promise<any> {
    this.logger.debug(data, '@handleJobQueuedEvent');
  }
}
