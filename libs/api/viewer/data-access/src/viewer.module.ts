import { Module } from '@nestjs/common';
import { ViewerRepository } from './viewer.repository';

@Module({
  providers: [ViewerRepository],
  exports: [ViewerRepository],
})
export class ViewerModule {}
