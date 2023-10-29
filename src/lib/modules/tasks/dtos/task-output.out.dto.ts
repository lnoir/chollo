import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class TaskOutputOutDto {
  @ApiProperty({
    description: 'The ID of the task output',
    example: 1,
  })
  id: number;

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
    description: 'The scheduled date and time for the task',
    example: '2023-01-01T12:00:00Z',
  })
  @IsDate()
  created: string;
  
  @ApiProperty({
    description: 'The scheduled date and time for the task',
    example: '2023-01-01T12:00:00Z',
  })
  @IsDate()
  deleted: string;
}
