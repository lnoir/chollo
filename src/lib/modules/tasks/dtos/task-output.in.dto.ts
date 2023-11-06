import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class TaskOutputInDto {
  @ApiProperty({
    description: 'The ID of the scheduled task',
    example: 1,
  })
  task: number;

  @ApiPropertyOptional({
    description: 'Text output',
    type: String,
  })
  text?: string;

  @ApiPropertyOptional({
    description: 'JSON output',
    type: String,
  })
  json?: Record<string, any>;

  @ApiProperty({
    description: 'Text output',
    type: String,
  })
  agent: string;

  @ApiProperty({
    description: 'Text output',
    type: String,
  })
  skill: string;
}
