import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';

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

  @ApiPropertyOptional({
    description: 'Parameters to pass to the agent skill',
    type: String,
  })
  @IsOptional()
  params?: string;

  @ApiPropertyOptional({
    description: 'Criteria that must be met to run this skill on an output item',
  })
  @IsOptional()
  filters?: object[];

  @ApiPropertyOptional({
    description: 'Text output',
    type: String,
  })
  @IsOptional()
  text?: string;

  @ApiPropertyOptional({
    description: 'JSON output',
    type: String,
  })
  @IsOptional()
  json?: Record<string, any>;
}
