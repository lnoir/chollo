import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class TaskStepInDto {
  @ApiProperty({
    description: 'The ID of the scheduled task',
    type: Number,
    example: 1,
  })
  task: number;

  @ApiProperty({
    description: 'The zero-based position of the step in the running order',
    type: Number,
    example: 0,
  })
  position: number;

  @ApiProperty({
    description: 'Agent category',
    type: String,
  })
  agent: string;

  @ApiProperty({
    description: 'Agent skill',
    type: String,
  })
  skill: string;

  @ApiProperty({
    description: 'Parameters to pass to the agent skill',
    type: String,
  })
  params?: string;

  @ApiProperty({
    description: 'Criteria that must be met to run this skill on an output item',
  })
  filters?: object[];

  @ApiProperty({
    description: 'Text output',
    type: String,
  })
  text?: string;

  @ApiProperty({
    description: 'JSON output',
    type: String,
  })
  json?: Record<string, any>;
}
