import { IsNumber, IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { JobStatus } from '../entities/job.entity';

export class JobInDto {
  
  @IsString()
  name: string;

  @IsNumber()
  task: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  recurring?: boolean;

  @IsOptional()
  @IsString()
  interval?: string; // date-fns-parseable relative string

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  scheduled?: Date;
}
