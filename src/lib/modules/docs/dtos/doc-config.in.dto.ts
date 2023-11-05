import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

export class DocConfigInDto {
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
  @IsObject()
  map?: Record<string, any>;

  @ApiProperty({
    description: 'Indicates if JavaScript is enabled',
    example: true,
  })
  @IsBoolean()
  js: boolean;

  @ApiProperty({
    description: 'The related document format',
    type: Number,
  })
  format?: number;
}
