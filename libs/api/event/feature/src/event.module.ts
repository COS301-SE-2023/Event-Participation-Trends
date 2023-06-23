import { EventModule as EventDataAccessModule } from '@event-participation-trends/api/event/data-access';
import { UserModule as UserDataAccessModule} from '@event-participation-trends/api/user/data-access';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventService } from './event.service';

import {
    CreateEventHandler,
    SendViewRequestHandler,
    DeclineViewRequestHandler,
    AcceptViewRequestHandler,
    RemoveViewerFromEventHandler,
    RemoveEventFromViewerHandler,
} from './commands';

import { 
    GetAllEventsHandler,
    GetManagedEventsHandler,
    GetUserViewingEventsHandler,
 } from './queries';

import {
    CreateEventEventHandler,
    SendViewRequestEventHandler,
    DeclineViewRequestEventHandler,
    AcceptViewRequestEventHandler,
    RemoveViewerFromEventEventHandler,
    RemoveEventFromViewerEventHandler,
} from './events';

import { GetAllViewRequestsHandler } from './queries/get-all-view-requests.handler';

import { EventsSagas } from './event.sagas';

export const CommandHandlers = [
    CreateEventHandler,
    SendViewRequestHandler,
    DeclineViewRequestHandler,
    AcceptViewRequestHandler,
    RemoveViewerFromEventHandler,
    RemoveEventFromViewerHandler,
]

export const EventHandlers = [
    CreateEventEventHandler,
    SendViewRequestEventHandler,
    DeclineViewRequestEventHandler,
    AcceptViewRequestEventHandler,
    RemoveViewerFromEventEventHandler,
    RemoveEventFromViewerEventHandler,
];

export const QueryHandlers = [
    GetAllEventsHandler,
    GetManagedEventsHandler,
    GetAllViewRequestsHandler,
    GetUserViewingEventsHandler,
];

@Module({
    imports: [CqrsModule, EventDataAccessModule, UserDataAccessModule],
    providers: [EventService, ...CommandHandlers, ...EventHandlers, ...QueryHandlers, EventsSagas],
    exports: [EventService],
})
export class EventModule {}