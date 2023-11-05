import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsNumber, IsOptional } from 'class-validator';
import { DocConfigOutDto } from './doc-config.out.dto';

export class DocFormatInDto {
  @ApiProperty({ description: 'The type of the doc format (html, json, xml, or text).' })
  @IsEnum(['html', 'json', 'xml', 'text'])
  type: string;

  @ApiProperty({ description: 'The name of the doc format.' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The location of the doc format.' })
  @IsString()
  location: string;
  
  @ApiProperty({ description: 'The agent to handle this doc format.' })
  @IsString()
  @IsOptional()
  agent?: string;

  @ApiProperty({ description: 'The source ID of the doc format.' })
  @IsNumber()
  source: number;

  @ApiPropertyOptional()
  config?: DocConfigOutDto;
}