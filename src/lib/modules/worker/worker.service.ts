import { Injectable } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Job } from '../queue/entities/job.entity';

@Injectable()
export class WorkerService {

  @EventPattern('job_created')
  async checkJob(@Payload() data: Job): Promise<any> {
    console.log('@GOT DATA!', data);
  }
}
