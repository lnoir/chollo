import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class TaskOutputInDto {
  @ApiProperty({
    description: 'The ID of the scheduled task',
    example: 1,
  })
  task: number;

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

  @ApiProperty({
    description: 'Text output',
    type: String,
  })
  agent?: string;

  @ApiProperty({
    description: 'Text output',
    type: String,
  })
  skill?: string;
}
