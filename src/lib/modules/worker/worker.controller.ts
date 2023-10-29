import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Job } from '../queue/entities/job.entity';

@Controller('worker')
export class WorkerController {

  @EventPattern('job_created')
  async checkJob(@Payload() data: Job): Promise<any> {
    console.log('@GOT DATA!', data);
  }
}
