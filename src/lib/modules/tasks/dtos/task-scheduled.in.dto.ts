import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
export class TaskScheduledInDto {
  @ApiProperty({
    description: 'The ID of the scheduled task',
    example: 1,
  })

  @ApiProperty({
    description: 'The source object',
    type: Number,
  })
  source: number;

  @ApiProperty({
    description: 'The format object',
    type: Number,
  })
  format: number;

  @ApiProperty({
    description: 'Criteria that will be used to filter data',
    example: 'job'
  })
  params?: string;

  @ApiProperty({
    description: 'The scheduled date and time for the task',
    example: '2023-01-01T12:00:00Z',
  })
  @IsDate()
  scheduled: string;
}
