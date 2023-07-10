import { Injectable } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { Action, Selector, State, Store } from '@ngxs/store';
import { SetCreateFloorPlanState, SetSensors } from '@event-participation-trends/app/createfloorplan/util';
import { SetError } from '@event-participation-trends/app/error/util';

// Once we know the interface for the create floor plan we can remove the comment from the line below
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CreateFloorPlanStateModel {
    sensors: {
        attrs: {
            x: number,
            y: number,
            width: number,
            height: number,
            cursor: string,
            draggable: boolean,
            cornerRadius: number,
            padding: number,
            fill: string,
            opacity: number,
            name: string,
            customId: string
        },
        isLinked: boolean,
    }[]
}

@State<CreateFloorPlanStateModel>({
    name: 'createfloorplan'
})

@Injectable()
export class CreateFloorPlanState {

    @Selector()
    static getSensors(state: CreateFloorPlanStateModel) {
        return state.sensors;
    }

    constructor(
        private store: Store,
        private appApiService: AppApiService
    ) {}

    @Action(SetCreateFloorPlanState)
    setCreateFloorPlanState(ctx: any, { payload }: SetCreateFloorPlanState) {
        ctx.patchState(payload);
    }

    @Action(SetSensors)
    setSensors(ctx: any, { payload }: SetSensors) {
        try {
            const state = ctx.getState();
            const newState = {
                ...state,
                sensors: payload
            };
            return ctx.dispatch(new SetCreateFloorPlanState(newState));
        } catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }
}