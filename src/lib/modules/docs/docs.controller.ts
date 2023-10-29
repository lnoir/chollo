import { Controller, Post, Body, Get, Param, Delete, Put, Query } from '@nestjs/common';
import { DocsService } from './docs.service';
import { DocSource } from './entities/doc-source.entity';
import { DocFormat } from './entities/doc-format.entity';
import { DocConfig } from './entities/doc-config.entity';
import { Doc } from './entities/doc.entity';
import { DocSourceDto } from './dtos/doc-source.dto';
import { DocFormatDto } from './dtos/doc-format.dto';
import { DocConfigDto } from './dtos/doc-config.dto';

@Controller('docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  // DocSource
  @Post('source')
  async insertDocSource(@Body() data: DocSourceDto): Promise<DocSource> {
    return this.docsService.insertDocSource(data);
  }

  @Put('source/:id')
  async updateDocSource(@Param('id') id: number, @Body() data: DocSourceDto): Promise<any> {
    return this.docsService.updateBy(DocSource, data, { id });
  }
  
  @Get('source/:id')
  async getDocSource(@Param('id') id: number): Promise<DocSource> {
    return this.docsService.getDocSource(id);
  }

  @Get('source')
  async getDocSources(): Promise<DocSource[]> {
    return this.docsService.getDocSources();
  }
  // END DocSource

  // DocFormat
  @Post('source/:sourceId/format')
  async insertDocFormat(
    @Param('sourceId') sourceId: number,
    @Body() data: DocFormatDto
  ): Promise<DocFormat> {
    return this.docsService.insertDocFormat(sourceId, data);
  }

  @Put('format/:id')
  async updateDocFormat(@Param('id') id: number, @Body() data: DocFormatDto): Promise<any> {
    return this.docsService.updateBy(DocFormat, data, { id });
  }
  
  @Get('format/:id')
  async getDocFormat(@Param('id') id: number): Promise<DocFormat> {
    return this.docsService.getDocFormat(id);
  }
  // END DocFormat

  // DocConfig
  @Post('format/:formatId/config')
  async insertDocConfig(
    @Param('formatId') formatId: number,
    @Body() data: DocConfigDto
  ): Promise<DocFormat> {
    return this.docsService.insertDocConfig(formatId, data);
  }

  @Put('config/:id')
  async updateDocConfig(@Param('id') id: number, @Body() data: any): Promise<any> {
    return this.docsService.updateBy(DocConfig, data, { id });
  }
  
  @Delete('doc/:id')
  async removeDocConfig(@Param('id') id: number): Promise<any> {
    return this.docsService.removeDocConfig(id);
  }

  @Get('config/:id')
  async getDocConfig(@Param('id') id: number): Promise<DocConfig> {
    return this.docsService.getDocConfig(id);
  }
  // END DocConfig

  // Doc
  @Post('doc')
  async insertDoc(@Body() data: any): Promise<number[]> {
    return this.docsService.insertDoc(data);
  }

  @Put('doc/:id')
  async updateDoc(@Param('id') id: number, @Body() data: any): Promise<any> {
    return this.docsService.updateBy(Doc, data, { id });
  }
  
  @Delete('doc/:id')
  async removeDoc(@Param('id') id: number): Promise<any> {
    return this.docsService.removeDoc(id);
  }

  @Get('doc')
  async getDocs(): Promise<Doc[]> {
    return this.docsService.getDocs();
  }

  @Get('doc/:id')
  async getDoc(@Param('id') id): Promise<Doc> {
    return this.docsService.getDocBy('id', id);
  }

  @Get('doc/:column/:value')
  async getDocBy(@Param('column') column: string, @Param('value') value: number | string): Promise<Doc | null> {
    return this.docsService.getDocBy(column, decodeURIComponent(value?.toString()));
  }
  // END Doc
}