import { Injectable } from '@angular/core';
import { Action, State } from '@ngxs/store';

// Once we know the interface for the manager's event page we can remove the comment from the line below
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ManagerEventsStateModel {}

@State<ManagerEventsStateModel>({
    name: 'managerevents'
})

@Injectable()
export class ManagerEventsState {}