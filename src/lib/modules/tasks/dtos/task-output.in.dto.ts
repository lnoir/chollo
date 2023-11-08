import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TaskOutputInDto {
  @ApiProperty({
    description: 'The ID of the scheduled task',
    example: 1,
  })
  task: number;

  @ApiProperty({
    description: 'The ID of the job that produced the output',
    example: 1,
  })
  job: number;

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
