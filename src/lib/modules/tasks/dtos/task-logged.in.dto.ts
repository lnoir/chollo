import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate, IsEnum } from 'class-validator';
import { JobStatus } from '../../../../types';

export class TaskLoggedOutDto {
  @ApiProperty({
    description: 'The ID of the logged task',
    example: 1,
  })
  @IsNumber()
  task: number;

  @ApiProperty({
    description: 'The ID of the job that produced the output',
    example: 1,
  })
  job: number;

  @ApiProperty({
    description: 'The summarised source',
  })
  @IsString()
  source: string;

  @ApiProperty({
    description: 'The summarised format',
  })
  @IsString()
  format: string;
  
  @ApiProperty({
    description: 'The status of the task',
    example: 'completed',
    enum: ['completed', 'cancelled', 'failed'],
  })
  @IsEnum(['completed', 'cancelled', 'failed'])
  status: JobStatus;

  @ApiProperty({
    description: 'Error message or any other info',
  })
  @IsString()
  message: string; 

  @ApiProperty({
    description: 'The start date and time of the task',
    example: '2023-01-01T12:00:00Z',
  })
  @IsDate()
  start: string;

  @ApiProperty({
    description: 'The end date and time of the task',
    example: '2023-01-01T12:05:00Z',
  })
  @IsDate()
  end: string;
}
