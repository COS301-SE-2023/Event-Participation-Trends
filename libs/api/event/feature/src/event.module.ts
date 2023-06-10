import { EventModule as EventDataAccessModule } from '@event-participation-trends/api/event/data-access';
import { UserModule as UserDataAccessModule} from '@event-participation-trends/api/user/data-access';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventService } from './event.service';

import {
    CreateEventHandler
} from './commands';

import { 
    GetAllEventsHandler
 } from './queries';

import {
    CreateEventEventHandler
} from './events';

export const CommandHandlers = [
    CreateEventHandler,
]

export const EventHandlers = [
    CreateEventEventHandler,
];

export const QueryHandlers = [
    GetAllEventsHandler
];

@Module({
    imports: [CqrsModule, EventDataAccessModule, UserDataAccessModule],
    providers: [EventService, ...CommandHandlers, ...EventHandlers, ...QueryHandlers],
    exports: [EventService],
})
export class EventModule {}