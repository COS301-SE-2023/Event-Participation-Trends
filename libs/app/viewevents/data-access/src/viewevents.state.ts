import { Injectable } from '@angular/core';
import { IEvent } from '@event-participation-trends/api/event/util';
import { Action, State } from '@ngxs/store';

// Once we know the interface for the Viewevents page we can remove the comment from the line below
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VieweventsStateModel {
    all_events: IEvent[];
    subscribed_events: IEvent[];
    unsubscribed_events: IEvent[];
    my_events: IEvent[];
    role: string;
    searchValue: string;
    address_location: string;
}

@State<VieweventsStateModel>({
    name: 'viewevents',
    defaults: {
        all_events: [],
        subscribed_events: [],
        unsubscribed_events: [],
        my_events: [],
        role: 'Viewer',
        searchValue: '',
        address_location: ''
    }
})

@Injectable()
export class VieweventsState {}