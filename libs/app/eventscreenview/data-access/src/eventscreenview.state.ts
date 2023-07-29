import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetEventScreenViewState, SetEventScreenViewTime } from '@event-participation-trends/app/eventscreenview/util';

export interface IEventScreenViewStateModel {
    currentTime: string;
}

@State<IEventScreenViewStateModel>({
    name: 'eventscreenview',
    defaults: {
        currentTime: ''
    }
})

@Injectable()
export class EventScreenViewState {

    @Selector()
    static currentTime(state: IEventScreenViewStateModel) {
        return state.currentTime;
    }

    @Action(SetEventScreenViewState)
    setEventScreenViewState(ctx: StateContext<IEventScreenViewStateModel>, { newState }: SetEventScreenViewState) {
        ctx.patchState({
            currentTime: newState.currentTime
        });
    }

    @Action(SetEventScreenViewTime)
    setEventScreenViewTime(ctx: StateContext<IEventScreenViewStateModel>, { newTime }: SetEventScreenViewTime) {
        ctx.patchState({
            currentTime: newTime
        });
    }
}