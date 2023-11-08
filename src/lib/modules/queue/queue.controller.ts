import { Controller, Delete, Logger, Param } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JOB_EVENT } from '../../../constants';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {

  private readonly logger = new Logger(QueueController.name);

  constructor(
    private readonly queueService: QueueService
  ) {}

  @MessagePattern(JOB_EVENT.COMPLETED)
  taskComplete(@Payload() data: any): void {
    this.logger.debug(data, '@taskComplete');
  }
  
  @MessagePattern(JOB_EVENT.FAILED)
  async taskFailed(@Payload() data: any): Promise<void> {
    this.logger.error(data, '@taskFailed');
  }

  @Delete('job/:id')
  async deleteJob(
    @Param('id') id: number
  ) {
    this.logger.debug(id, '@deleteJob');
    return await this.queueService.deleteJob(id);
  }
}
