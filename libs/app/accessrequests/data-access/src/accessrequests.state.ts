import { Injectable } from '@angular/core';
import { ApproveAccessRequest, GetAccessRequests, RejectAccessRequest, SetAccessRequests } from '@event-participation-trends/app/accessrequests/util';
import { SetError } from '@event-participation-trends/app/error/util';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AccessRequestsApi } from './accessrequests.api';

interface IAccessRequest {
    userId: string;
    email: string;
    role: string;
}

export interface AccessRequestsStateModel {
    requests: IAccessRequest[];
}

@State<AccessRequestsStateModel>({
    name: 'accessrequests',
    defaults: {
        requests: []
    }
})

@Injectable()
export class AccessRequestsState {

    
    // constructor(private readonly accessRequestsApi: AccessRequestsApi) { }
    
    @Selector()
    static accessRequests(state: AccessRequestsStateModel) {
        return state.requests;
    }

    @Action(SetAccessRequests)
    setAccessRequests(ctx: StateContext<AccessRequestsStateModel>, { accessRequests }: SetAccessRequests) {
        return ctx.patchState({ requests: accessRequests });
    }

    // @Action(GetAccessRequests)
    // async getAccessRequests(ctx: StateContext<AccessRequestsStateModel>, { eventName }: GetAccessRequests) {
    //     try {
    //         const accessRequests = await this.accessRequestsApi.getAccessRequests(eventName);
    //         return ctx.patchState({ accessRequests });
    //     }
    //     catch (error) {
    //         return ctx.dispatch(new SetError('Unable to get access requests'));
    //     }
    // }

    @Action(RejectAccessRequest)
    async rejectAccessRequest(ctx: StateContext<AccessRequestsStateModel>, { userId }: RejectAccessRequest) {
        try{
            // const responseRef = this.accessRequestsApi.rejectAccessRequest(userId);

            // filter out the rejected access request
            ctx.setState((prevState) => {
                const filteredRequests = prevState.requests?.filter(
                  (accessRequest) => accessRequest.userId !== userId
                );
                return {
                  ...prevState,
                  requests: filteredRequests,
                };
            });
              

            const state = ctx.getState();

            return ctx.dispatch(new SetAccessRequests(state.requests));
        }
        catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(ApproveAccessRequest)
    async approveAccessRequest(ctx: StateContext<AccessRequestsStateModel>, { userId }: ApproveAccessRequest) {
        try{
            // const responseRef = this.accessRequestsApi.rejectAccessRequest(userId);

            ctx.setState((prevState) => {
                const filteredRequests = prevState.requests?.filter(
                  (accessRequest) => accessRequest.userId !== userId
                );
                return {
                  ...prevState,
                  requests: filteredRequests,
                };
            });
            
            const state = ctx.getState();

            return ctx.dispatch(new SetAccessRequests(state.requests));
        }
        catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }
}