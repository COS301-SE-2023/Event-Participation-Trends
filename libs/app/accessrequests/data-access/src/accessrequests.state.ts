import { Injectable } from '@angular/core';
import { GetAccessRequests } from '@event-participation-trends/app/accessrequests/util';
import { SetError } from '@event-participation-trends/app/error/util';
import { Action, State, StateContext } from '@ngxs/store';
import { AccessRequestsApi } from './accessrequests.api';

// Once we know the interface for the AccessRequests page we can remove the comment from the line below
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AccessRequestsStateModel {
    accessRequests: any[];
}

@State<AccessRequestsStateModel>({
    name: 'accessrequests',
    defaults: {
        accessRequests: []
    }
})

@Injectable()
export class AccessRequestsState {

    constructor(private readonly accessRequestsApi: AccessRequestsApi) { }

    @Action(GetAccessRequests)
    async getAccessRequests(ctx: StateContext<AccessRequestsStateModel>, { eventName }: GetAccessRequests) {
        try {
            const accessRequests = await this.accessRequestsApi.getAccessRequests(eventName);
            return ctx.patchState({ accessRequests });
        }
        catch (error) {
            return ctx.dispatch(new SetError('Unable to get access requests'));
        }
    }
}