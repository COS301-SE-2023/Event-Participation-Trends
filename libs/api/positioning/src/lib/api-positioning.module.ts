import { Module } from '@nestjs/common';
import { PositioningService } from './api-positioning.service';

@Module({
  controllers: [],
  providers: [PositioningService],
  exports: [PositioningService],
})
export class ApiPositioningModule {}
