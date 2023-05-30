import { Injectable } from '@angular/core';
import { Action, State } from '@ngxs/store';

// Once we know the interface for the event full view page we can remove the comment from the line below
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EventFullViewStateModel {}

@State<EventFullViewStateModel>({
    name: 'event-full-view'
})

@Injectable()
export class EventFullViewState {}