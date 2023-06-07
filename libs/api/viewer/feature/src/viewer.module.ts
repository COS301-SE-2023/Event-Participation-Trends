import { ViewerModule as ViewerDataAccessModule } from '@event-participation-trends/api/viewer/data-access';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import {
    CreateViewerHandler,
} from './commands';
import { ViewerService } from './viewer.service';
import {
    CreateViewerEventHandler,
} from './events';


export const CommandHandlers = [
    CreateViewerHandler,
]

export const EventHandlers = [
    CreateViewerEventHandler,
];


@Module({
    imports: [CqrsModule, ViewerDataAccessModule],
    providers: [ViewerService, ...CommandHandlers, ...EventHandlers],
    exports: [ViewerService],
})
export class ViewerModule {}