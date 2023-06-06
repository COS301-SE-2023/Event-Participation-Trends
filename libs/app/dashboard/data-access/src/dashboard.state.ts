import { Injectable } from '@angular/core';
import { Action, Select, Selector, State, StateContext } from '@ngxs/store';
import { GetAccessRequests, GetDashboardStatistics, SetDashboardState } from '@event-participation-trends/app/dashboard/util';
import { SetError } from '@event-participation-trends/app/error/util';
import { DashboardApi } from './dashboard.api';

// Once we know the interface for the dashboard page we can remove the comment from the line below
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DashboardStateModel {
    accessRequests: any[];
    dashboardStatistics: any[];
}

@State<DashboardStateModel>({
    name: 'dashboard',
    defaults: {
        accessRequests: [],
        dashboardStatistics: []
    }
})

@Injectable()
export class DashboardState {
    constructor(private readonly dashboardApi: DashboardApi) { }
    
    @Selector()
    static accessRequests(state: DashboardStateModel) {
        return state.accessRequests;
    }

    @Selector()
    static dashboardStatistics(state: DashboardStateModel) {
        return state.dashboardStatistics;
    }

    @Action(GetAccessRequests)
    async getAccessRequests(ctx: StateContext<DashboardStateModel>, { eventName }: GetAccessRequests) {
        try {
            const accessRequests = await this.dashboardApi.getAccessRequests(eventName);
            return ctx.patchState({ accessRequests });
        }
        catch (error) {
            return ctx.dispatch(new SetError('Unable to get access requests'));
        }
    }

    @Action(GetDashboardStatistics)
    async getDashboardStatistics(ctx: StateContext<DashboardStateModel>, { eventName }: GetDashboardStatistics) {
        try {
            const dashboardStatistics = await this.dashboardApi.getDashboardStatistics(eventName);
            return ctx.patchState({ dashboardStatistics });
        }
        catch (error) {
            return ctx.dispatch(new SetError('Unable to get dashboard statistics'));
        }
    }
}