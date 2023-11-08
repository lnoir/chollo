import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsBoolean, IsObject, IsArray } from 'class-validator';
import { DocFormatDto } from './doc-format.dto';
import { PropertySelectorMap } from '../docs.types';

export class DocConfigOutDto {
  @ApiPropertyOptional({
    description: 'The selector type for the document configuration',
    enum: ['element', 'pattern'],
    example: 'element',
  })
  @IsOptional()
  @IsEnum(['element', 'pattern'])
  selector_type?: string;

  @ApiPropertyOptional({
    description: 'The selector for the document configuration',
    example: '.my-element',
  })
  @IsOptional()
  @IsString()
  selector?: string;

  @ApiPropertyOptional({
    description: 'The mapping for the document configuration',
    example: '{"title": ".my-title", "content": ".my-content"}',
    type: "object",
  })
  @IsOptional()
  @IsArray()
  map?: PropertySelectorMap[];

  @ApiProperty({
    description: 'Indicates if JavaScript is enabled',
    example: true,
  })
  @IsBoolean()
  js: boolean;

  @ApiProperty({
    description: 'The related document format',
    type: DocFormatDto,
  })
  format?: DocFormatDto;
}
