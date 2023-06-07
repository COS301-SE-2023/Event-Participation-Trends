import { ViewerModule } from '@event-participation-trends/api/viewer/feature';
import { Module } from '@nestjs/common';

@Module({
    imports: [ViewerModule],
})
export class CoreModule {}