import { ApiProperty } from '@nestjs/swagger';
import { DocFormatDto } from './doc-format.dto';
import { IsOptional } from 'class-validator';

export class DocSourceDto {
  @ApiProperty({ enum: ['web', 'drive', 'text'] })
  type: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  location: string;

  @IsOptional()
  format?: DocFormatDto;
}