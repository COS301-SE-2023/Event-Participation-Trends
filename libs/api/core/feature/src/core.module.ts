import { ViewerModule, ViewerService } from '@event-participation-trends/api/viewer/feature';
import { ViewerController } from '../src/controllers/viewer.controller'
import { Module } from '@nestjs/common';

@Module({
    imports: [ViewerModule],
    controllers: [ViewerController],
    exports: [ViewerService]
})
export class CoreModule {}