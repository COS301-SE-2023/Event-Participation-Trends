import { Injectable } from '@angular/core';
import { Action, Select, Selector, State, StateContext } from '@ngxs/store';
import { GetDashboardStatistics, SetDashboardState } from '@event-participation-trends/app/dashboard/util';
import { SetError } from '@event-participation-trends/app/error/util';
import { DashboardApi } from './dashboard.api';

// Once we know the interface for the dashboard page we can remove the comment from the line below
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DashboardStateModel {
    event: {
        eventData: {
            eventId: string;
            eventName: string | undefined;
        }
        accessRequests: any[] | null | undefined;
        dashboardStatistics: any[] | null | undefined;
    }
}

@State<DashboardStateModel>({
    name: 'dashboard',
    defaults: {
        event: {
            eventData: {
                eventId: '',
                eventName: ''
            },
            accessRequests: [],
            dashboardStatistics: []
        }
    }
})

@Injectable()
export class DashboardState {
    // constructor(private readonly dashboardApi: DashboardApi) { }

    @Selector()
    static eventData({ event }: DashboardStateModel) {
        return event.eventData;
    }

    @Selector()
    static dashboardStatistics({ event }: DashboardStateModel) {
        return event.dashboardStatistics;
    }

    @Action(SetDashboardState)
    setDashboardState(ctx: StateContext<DashboardStateModel>, { eventData, accessRequests, statistics }: SetDashboardState) {
        return ctx.patchState({
            event: {
                eventData: eventData || { eventId: '', eventName: '' },
                accessRequests : accessRequests || [],
                dashboardStatistics: statistics || []
            }
        });
    }

    // @Action(GetDashboardStatistics)
    // async getDashboardStatistics(ctx: StateContext<DashboardStateModel>, { eventName }: GetDashboardStatistics) {
    //     try {
    //         const dashboardStatistics = await this.dashboardApi.getDashboardStatistics(eventName);
    //         return ctx.patchState({ dashboardStatistics });
    //     }
    //     catch (error) {
    //         return ctx.dispatch(new SetError('Unable to get dashboard statistics'));
    //     }
    // }
}