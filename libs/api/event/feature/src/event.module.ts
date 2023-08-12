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
    UpdateEventDetailsHandler,
    UpdateFloorlayoutHandler,
    AddDevicePositionHandler,
    AddViewerHandler,
    DeleteEventHandler,
    RemoveEventFromViewersHandler,
} from './commands';

import { 
    GetAllEventsHandler,
    GetManagedEventsHandler,
    GetUserViewingEventsHandler,
    GetEventHandler,
    GetEventFloorlayoutHandler,
    GetEventDevicePositionHandler,
    GetAllEventCategoriesHandler,
    GetManagedEventCategoriesHandler,
    GetFloorplanBoundariesQueryHandler
 } from './queries';

import {
    CreateEventEventHandler,
    SendViewRequestEventHandler,
    DeclineViewRequestEventHandler,
    AcceptViewRequestEventHandler,
    RemoveViewerFromEventEventHandler,
    RemoveEventFromViewerEventHandler,
    UpdateEventDetialsEventHandler,
    UpdateFloorlayoutEventHandler,
    AddDevicePositionEventHandler,
    AddViewerEventHandler,
    DeleteEventEventHandler,
    RemoveEventFromViewersEventHandler,
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
    UpdateEventDetailsHandler,
    UpdateFloorlayoutHandler,
    AddDevicePositionHandler,
    AddViewerHandler,
    DeleteEventHandler,
    RemoveEventFromViewersHandler,
]

export const EventHandlers = [
    CreateEventEventHandler,
    SendViewRequestEventHandler,
    DeclineViewRequestEventHandler,
    AcceptViewRequestEventHandler,
    RemoveViewerFromEventEventHandler,
    RemoveEventFromViewerEventHandler,
    UpdateEventDetialsEventHandler,
    UpdateFloorlayoutEventHandler,
    AddDevicePositionEventHandler,
    AddViewerEventHandler,
    DeleteEventEventHandler,
    RemoveEventFromViewersEventHandler,
];

export const QueryHandlers = [
    GetAllEventsHandler,
    GetManagedEventsHandler,
    GetAllViewRequestsHandler,
    GetUserViewingEventsHandler,
    GetEventHandler,
    GetEventFloorlayoutHandler,
    GetEventDevicePositionHandler,
    GetAllEventCategoriesHandler,
    GetManagedEventCategoriesHandler,
    GetFloorplanBoundariesQueryHandler
];


@Module({
    imports: [CqrsModule, EventDataAccessModule, UserDataAccessModule],
    providers: [EventService, ...CommandHandlers, ...EventHandlers, ...QueryHandlers, EventsSagas],
    exports: [EventService],
})
export class EventModule {}