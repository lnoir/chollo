import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { DocFormatDto } from '../../docs/dtos/doc-format.dto';
import { DocSourceDto } from '../../docs/dtos/doc-source.dto';
import { Recurrence } from '../tasks.types';

export class TaskScheduledOutDto {
  @ApiProperty({
    description: 'The ID of the scheduled task',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The name of the scheduled task',
    example: 1,
  })
  name: string;
  
  @ApiProperty({
    description: 'The source object',
    type: DocSourceDto,
  })
  source: DocSourceDto;

  @ApiProperty({
    description: 'The format object',
    type: DocFormatDto,
  })
  format: DocFormatDto;

  @ApiProperty({
    description: 'The category of agent to handle the task',
    example: 'job'
  })
  agent: string;

  @ApiProperty({
    description: 'The skill that the agent will apply',
    example: 'job'
  })
  skill: string;

  @ApiProperty({
    description: 'Criteria that will be used to filter data',
    example: 'job'
  })
  params?: string;

  @ApiProperty({
    description: 'The scheduled date and time for the task',
    example: '2023-01-01T12:00:00Z',
  })
  scheduled: string;

  @ApiPropertyOptional({
    description: 'The scheduled date and time for the task',
    example: '{unit: "hours", "value": "24"}',
  })
  @IsOptional()
  interval?: Recurrence;
}
