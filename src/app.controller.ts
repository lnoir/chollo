import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { DocSource } from './lib/modules/docs/entities/doc-source.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<any> {
    return { status: 'ready' }
  }

  @Post()
  async createSource(): Promise<DocSource> {
    return 
  }
}

