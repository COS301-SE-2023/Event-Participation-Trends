import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import {
  SetEndTime,
  SetStartTime,
  SetEventScreenViewState,
  SetCurrentTime,
  UpdateUsersDetectedPerHour,
} from '@event-participation-trends/app/eventscreenview/util';
import { SetError } from '@event-participation-trends/app/error/util';

export interface IEventScreenViewStateModel {
  currentTime: Date | undefined | null;
  startTime: Date | undefined | null;
  endTime: Date | undefined | null;
  usersDetectedPerHour: {time: string, detected: number}[] | undefined | null;
}

@State<IEventScreenViewStateModel>({
  name: 'eventscreenview',
  defaults: {
    currentTime: null,
    startTime: null,
    endTime: null,
    usersDetectedPerHour: null,
  },
})
@Injectable()
export class EventScreenViewState {
  constructor(private readonly store: Store) {}

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
  setEventScreenViewState(
    ctx: StateContext<IEventScreenViewStateModel>,
    { newState }: SetEventScreenViewState
  ) {
    ctx.patchState({
      currentTime: newState.currentTime,
      startTime: newState.startTime,
      endTime: newState.endTime,
      usersDetectedPerHour: newState.usersDetectedPerHour,
    });
  }

  @Action(SetCurrentTime)
  setCurrentTime(
    ctx: StateContext<IEventScreenViewStateModel>,
    { currentTime }: SetCurrentTime
  ) {
    try {
      const state = ctx.getState();

      const newState = {
        ...state,
        currentTime: currentTime,
      };

      return ctx.dispatch(new SetEventScreenViewState(newState));
    } catch (error) {
      return this.store.dispatch(new SetError((error as Error).message));
    }
  }

  @Action(SetStartTime)
  setStartTime(
    ctx: StateContext<IEventScreenViewStateModel>,
    { startTime }: SetStartTime
  ) {
    try {
      const state = ctx.getState();
      const newState = {
        ...state,
        startTime: startTime,
      };

      return ctx.dispatch(new SetEventScreenViewState(newState));
    } catch (error) {
      return this.store.dispatch(new SetError((error as Error).message));
    }
  }

  @Action(SetEndTime)
  setEndTime(
    ctx: StateContext<IEventScreenViewStateModel>,
    { endTime }: SetEndTime
  ) {
    try {
      const state = ctx.getState();

      const newState = {
        ...state,
        endTime: endTime,
      };

      return ctx.dispatch(new SetEventScreenViewState(newState));
    } catch (error) {
      return this.store.dispatch(new SetError((error as Error).message));
    }
  }

  @Action(UpdateUsersDetectedPerHour)
  updateUsersDetectedPerHour(
    ctx: StateContext<IEventScreenViewStateModel>,
    { usersDetectedPerHour }: UpdateUsersDetectedPerHour
  ) {
    try {
      const state = ctx.getState();

      const newState = {
        ...state,
        usersDetectedPerHour: usersDetectedPerHour,
      };

      return ctx.dispatch(new SetEventScreenViewState(newState));
    } catch (error) {
      return this.store.dispatch(new SetError((error as Error).message));
    }
  }
}
