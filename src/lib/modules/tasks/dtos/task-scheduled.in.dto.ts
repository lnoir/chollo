import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
export class TaskScheduledInDto {
  @ApiProperty({
    description: 'The ID of the scheduled task',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({
    description: 'The name of the scheduled task',
    example: 1,
  })
  name: string;

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

  @ApiPropertyOptional({
    description: 'Criteria that will be used to filter data',
    example: 'job'
  })
  @IsOptional()
  params?: string;

  @ApiPropertyOptional({
    description: 'The scheduled date and time for the task',
    example: '2023-01-01T12:00:00Z',
  })
  @IsDate()
  @IsOptional()
  scheduled?: string;
}
