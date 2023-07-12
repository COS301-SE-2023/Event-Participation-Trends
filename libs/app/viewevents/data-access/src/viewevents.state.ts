import { Injectable } from '@angular/core';
import { IEvent, IGetAllEventsResponse } from '@event-participation-trends/api/event/util';
import { AppApiService } from '@event-participation-trends/app/api';
import { Action, State, StateContext } from '@ngxs/store';
import { GetAllEvents, GetMyEvents, GetRole, GetSubscribedEvents, GetUnsubscribedEvents, SetAddressLocation, SetAllEvents, SetMyEvents, SetRole, SetSearchValue, SetSubscribedEvents, SetUnsubscribedEvents, SetViewEvents } from '@event-participation-trends/app/viewevents/util';
import { SetError } from '@event-participation-trends/app/error/util';
import { Observable } from 'rxjs';
import { IGetUserRoleResponse } from '@event-participation-trends/api/user/util';

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
        role: '',
        searchValue: '',
        address_location: ''
    }
})

@Injectable()
export class VieweventsState {

    constructor(
        private readonly appApiService: AppApiService,
    ) {}

    // Setter Actions

    @Action(SetViewEvents)
    setViewEvents(ctx: StateContext<VieweventsStateModel>, { newState }: SetViewEvents) {
        ctx.patchState({
            all_events: newState.all_events,
            subscribed_events: newState.subscribed_events,
            unsubscribed_events: newState.unsubscribed_events,
            my_events: newState.my_events,
            role: newState.role,
            searchValue: newState.searchValue,
            address_location: newState.address_location
        });
    }

    @Action(SetAllEvents)
    setAllEvents(ctx: StateContext<VieweventsStateModel>, { updatedEvents }: SetAllEvents) {
        try {
            const state = ctx.getState();

            const newState = {
                ...state,
                all_events: updatedEvents
            };

            return ctx.dispatch(new SetViewEvents(newState));
        } catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(SetSubscribedEvents)
    setSubscribedEvents(ctx: StateContext<VieweventsStateModel>, { updatedEvents }: SetSubscribedEvents) {
        try {
            const state = ctx.getState();

            const newState = {
                ...state,
                subscribed_events: updatedEvents
            };

            return ctx.dispatch(new SetViewEvents(newState));
        } catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(SetUnsubscribedEvents)
    setUnsubscribedEvents(ctx: StateContext<VieweventsStateModel>, { updatedEvents }: SetUnsubscribedEvents) {
        try {
            const state = ctx.getState();

            const newState = {
                ...state,
                unsubscribed_events: updatedEvents
            };

            return ctx.dispatch(new SetViewEvents(newState));
        } catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(SetMyEvents)
    setMyEvents(ctx: StateContext<VieweventsStateModel>, { updatedEvents }: SetMyEvents) {
        try {
            const state = ctx.getState();

            const newState = {
                ...state,
                my_events: updatedEvents
            };

            return ctx.dispatch(new SetViewEvents(newState));
        } catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(SetRole)
    setRole(ctx: StateContext<VieweventsStateModel>, { newRole }: SetRole) {
        try {
            const state = ctx.getState();

            const newState = {
                ...state,
                role: newRole ? newRole : ''
            };

            return ctx.dispatch(new SetViewEvents(newState));
        } catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(SetSearchValue)
    setSearchValue(ctx: StateContext<VieweventsStateModel>, { newSearchValue }: SetSearchValue) {
        try {
            const state = ctx.getState();

            const newState = {
                ...state,
                searchValue: newSearchValue
            };

            return ctx.dispatch(new SetViewEvents(newState));
        } catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }

    // Getters

    @Action(GetAllEvents)
    async getAllEvents(ctx: StateContext<VieweventsStateModel>) {
        try {
            const response: Observable<IGetAllEventsResponse> = await this.appApiService.getAllEvents();

            return response.subscribe((res: IGetAllEventsResponse) => {
                const allEvents = res.events;
                return ctx.dispatch(new SetAllEvents(allEvents));
            });
        } catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(GetSubscribedEvents)
    async getSubscribedEvents(ctx: StateContext<VieweventsStateModel>) {
        try {
            const response: Observable<IGetAllEventsResponse> = await this.appApiService.getSubscribedEvents();

            return response.subscribe((res: IGetAllEventsResponse) => {
                const subscribedEvents = res.events;
                return ctx.dispatch(new SetSubscribedEvents(subscribedEvents));
            });
        } catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(GetMyEvents)
    async getMyEvents(ctx: StateContext<VieweventsStateModel>) {
        try {
            const response: Observable<IGetAllEventsResponse> = await this.appApiService.getManagedEvents();

            return response.subscribe((res: IGetAllEventsResponse) => {
                const myEvents = res.events;
                return ctx.dispatch(new SetMyEvents(myEvents));
            });
        } catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }  

    @Action(GetRole)
    async getRole(ctx: StateContext<VieweventsStateModel>) {
        try {
            const response: Observable<IGetUserRoleResponse> = await this.appApiService.getRole();

            return response.subscribe((res: IGetUserRoleResponse) => {
                const role = res.userRole;
                return ctx.dispatch(new SetRole(role));
            });
        } catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }
}