import { Injectable } from '@angular/core';
import { Action, State } from '@ngxs/store';

// Once we know the interface for the view-events page we can remove the comment from the line below
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ViewEventsStateModel {}

@State<ViewEventsStateModel>({
    name: 'view-events'
})

@Injectable()
export class ViewEventsState {}