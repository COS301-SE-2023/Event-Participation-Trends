import { Injectable } from '@angular/core';
import { Action, State } from '@ngxs/store';

// Once we know the interface for the compare-events page we can remove the comment from the line below
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CompareEventsStateModel {}

@State<CompareEventsStateModel>({
    name: 'compare-events'
})

@Injectable()
export class CompareEventsState {}