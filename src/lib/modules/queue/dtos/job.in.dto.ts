import { IsNumber, IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { JobStatus } from '../../../../types';

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
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsOptional()
  scheduled?: Date;
}
