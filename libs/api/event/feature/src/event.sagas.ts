import { 
    AcceptViewRequestEvent, 
    RemoveViewerFromEventEvent,
} from '@event-participation-trends/api/event/util';
import {
    AddViewingEventCommand
} from '@event-participation-trends/api/user/util';
import{
    RemoveEventFromViewerCommand
} from '@event-participation-trends/api/event/util';
import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';

@Injectable()
export class EventsSagas {
    @Saga()
    onAcceptViewRequestEvent = (events$: Observable<any>): Observable<ICommand> => {
      return events$.pipe(
        ofType(AcceptViewRequestEvent),
        map((event: AcceptViewRequestEvent) => new AddViewingEventCommand({request: {userEmail: event.event.userEmail, eventId: <string> <unknown> event.event.eventId } })),
      );
    };

    @Saga()
    onViewerFromEvent = (events$: Observable<any>): Observable<ICommand> => {
      return events$.pipe(
        ofType(RemoveViewerFromEventEvent),
        map((event: RemoveViewerFromEventEvent) => new RemoveEventFromViewerCommand({userEmail: event.event.userEmail, eventId: <string> <unknown> event.event.eventId})),
      );
    };
}