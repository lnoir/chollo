import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doc } from './entities/doc.entity';
import { DocsService } from './docs.service';
import { DocSource } from './entities/doc-source.entity';
import { DocFormat } from './entities/doc-format.entity';
import { DocConfig } from './entities/doc-config.entity';
import { DocsController } from './docs.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([DocSource, DocFormat, DocConfig, Doc]),
  ],
  providers: [DocsService],
  controllers: [DocsController],
  exports: [TypeOrmModule, DocsService]
})
export class DocsModule {}
