import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { SetEventScreenViewEndTime, SetEventScreenViewStartTime, SetEventScreenViewState, SetEventScreenViewTime } from '@event-participation-trends/app/eventscreenview/util';
import { SetError } from '@event-participation-trends/app/error/util';

export interface IEventScreenViewStateModel {
    currentTime: string | undefined;
    startTime: string | undefined;
    endTime: string | undefined;
}

@State<IEventScreenViewStateModel>({
    name: 'eventscreenview',
    defaults: {
        currentTime: '',
        startTime: '',
        endTime: ''
    }
})

@Injectable()
export class EventScreenViewState {

    constructor(
        private readonly store: Store
    ) {}

    @Selector()
    static currentTime(state: IEventScreenViewStateModel) {
        return state.currentTime;
    }

    @Selector()
    static startTime(state: IEventScreenViewStateModel) {
        return state.startTime;
    }

    @Selector()
    static endTime(state: IEventScreenViewStateModel) {
        return state.endTime;
    }

    @Action(SetEventScreenViewState)
    setEventScreenViewState(ctx: StateContext<IEventScreenViewStateModel>, { newState }: SetEventScreenViewState) {
        ctx.patchState({
            currentTime: newState.currentTime
        });
    }

    @Action(SetEventScreenViewTime)
    setEventScreenViewTime(ctx: StateContext<IEventScreenViewStateModel>, { newTime }: SetEventScreenViewTime) {
        try {
            const state = ctx.getState();

            const newState = {
                ...state,
                currentTime: newTime
            };

            return ctx.dispatch(new SetEventScreenViewState(newState));
        } catch (error) {
            return this.store.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(SetEventScreenViewStartTime)
    setEventScreenViewStartTime(ctx: StateContext<IEventScreenViewStateModel>, { startTime }: SetEventScreenViewStartTime) {
        try {
            const state = ctx.getState();

            const newState = {
                ...state,
                startTime: startTime
            };

            return ctx.dispatch(new SetEventScreenViewState(newState));
        } catch (error) {
            return this.store.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(SetEventScreenViewEndTime)
    setEventScreenViewEndTime(ctx: StateContext<IEventScreenViewStateModel>, { endTime }: SetEventScreenViewEndTime) {
        try {
            const state = ctx.getState();

            const newState = {
                ...state,
                endTime: endTime
            };

            return ctx.dispatch(new SetEventScreenViewState(newState));
        } catch (error) {
            return this.store.dispatch(new SetError((error as Error).message));
        }
    }

}