import { 
    AcceptViewRequestEvent, 
    RemoveViewerFromEventEvent,
    CreateEventEvent,
    AddViewerEvent,
    DeleteEventEvent,
    UploadImageEvent,
} from '@event-participation-trends/api/event/util';
import {
    AddViewingEventCommand,
    AddViewingEventByNameCommand,
    AddEventToAdminCommand,
} from '@event-participation-trends/api/user/util';
import{
    RemoveEventFromViewerCommand,
    RemoveEventFromViewersCommand,
    AddImageToEventCommand,
} from '@event-participation-trends/api/event/util';
import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { from, map, mergeMap, Observable } from 'rxjs';

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

    @Saga()
    onCreateEventEvent = (events$: Observable<any>): Observable<ICommand> => {
        return events$.pipe(
            ofType(CreateEventEvent),
            mergeMap((event: CreateEventEvent) => {
              const commands: ICommand[] = [];
    
              commands.push(new AddViewingEventByNameCommand({ eventName: event.event.Name || "" }));
        
              commands.push(new AddEventToAdminCommand({ eventName: event.event.Name || "" }));

              return from(commands);
            })
          );
    };

    @Saga()
    onAddEventViewer = (events$: Observable<any>): Observable<ICommand> => {
      return events$.pipe(
        ofType(AddViewerEvent),
        map((event: AddViewerEvent) => new AddViewingEventCommand({request: {userEmail: event.event.UserEmail, eventId: <string> <unknown> event.event.eventId } })),
      );
    };

    @Saga()
    onEventDelete = (events$: Observable<any>): Observable<ICommand> => {
      return events$.pipe(
        ofType(DeleteEventEvent),
        map((event: DeleteEventEvent) => new RemoveEventFromViewersCommand(event.event)),
      );
    };

    @Saga()
    onImageUpload = (events$: Observable<any>): Observable<ICommand> => {
      return events$.pipe(
        ofType(UploadImageEvent),
        map((event: UploadImageEvent) => new AddImageToEventCommand({
                eventId: <string> <unknown> event.image.eventId, 
                floorlayoutImg: event.image.imageBase64, 
        })),
      );
    };
}