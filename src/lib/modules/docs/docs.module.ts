import { Module } from '@nestjs/common';
import { DocsService } from './docs.service';
import { DocsController } from './docs.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    SharedModule,
  ],
  providers: [DocsService],
  controllers: [DocsController],
  exports: [DocsService]
})
export class DocsModule {}
