import { EventModule as EventDataAccessModule } from '@event-participation-trends/api/event/data-access';
import { UserModule as UserDataAccessModule} from '@event-participation-trends/api/user/data-access';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventService } from './event.service';

import {
    CreateEventHandler
} from './commands';

import {
    CreateEventEventHandler
} from './events';

export const CommandHandlers = [
    CreateEventHandler,
]

export const EventHandlers = [
    CreateEventEventHandler,
];


@Module({
    imports: [CqrsModule, EventDataAccessModule, UserDataAccessModule],
    providers: [EventService, ...CommandHandlers, ...EventHandlers],
    exports: [EventService],
})
export class EventModule {}