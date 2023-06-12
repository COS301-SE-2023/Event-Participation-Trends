import { EventModule as EventDataAccessModule } from '@event-participation-trends/api/event/data-access';
import { UserModule as UserDataAccessModule} from '@event-participation-trends/api/user/data-access';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventService } from './event.service';

import {
    CreateEventHandler,
    SendViewRequestHandler,
} from './commands';

import { 
    GetAllEventsHandler,
    GetManagedEventsHandler,
 } from './queries';

import {
    CreateEventEventHandler,
    SendViewRequestEventHandler,
} from './events';

export const CommandHandlers = [
    CreateEventHandler,
    SendViewRequestHandler,
]

export const EventHandlers = [
    CreateEventEventHandler,
    SendViewRequestEventHandler,
];

export const QueryHandlers = [
    GetAllEventsHandler,
    GetManagedEventsHandler,
];

@Module({
    imports: [CqrsModule, EventDataAccessModule, UserDataAccessModule],
    providers: [EventService, ...CommandHandlers, ...EventHandlers, ...QueryHandlers],
    exports: [EventService],
})
export class EventModule {}