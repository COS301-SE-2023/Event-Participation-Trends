import { Injectable } from '@angular/core';
import { AppApiService } from '@event-participation-trends/app/api';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import Konva from 'konva';

export interface ISensorState {
    object: Konva.Circle,
    isLinked: boolean,
}

// Once we know the interface for the create floor plan we can remove the comment from the line below
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FloorPlanEditorStateModel {
    activeSensor: ISensorState | null,
    sensors: ISensorState[]
}

@State<FloorPlanEditorStateModel>({
    name: 'createfloorplan',
    defaults: {
        activeSensor: null,
        sensors: []
    }
})

@Injectable()
export class FloorPlanEditorState {

    @Selector()
    static getSensors(state: FloorPlanEditorStateModel) {
        return state.sensors;
    }

    @Selector()
    static getActiveSensor(state: FloorPlanEditorStateModel) {
        return state.activeSensor;
    }

    constructor(
        private store: Store,
        private appApiService: AppApiService
    ) {}

    @Action(SetCreateFloorPlanState)
    setCreateFloorPlanState(ctx: StateContext<FloorPlanEditorStateModel>, { payload }: SetCreateFloorPlanState) {
        ctx.patchState(payload);
    }

    @Action(SetSensors)
    setSensors(ctx: StateContext<FloorPlanEditorStateModel>, { payload }: SetSensors) {
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

    @Action(AddSensor)
    async addSensor(ctx: StateContext<FloorPlanEditorStateModel>, { sensor }: AddSensor) {
        try {
            const state = ctx.getState();            
            const newSensorState = {
                object: sensor,
                isLinked: false
            }
            const newState = {
                ...state,
                sensors: [...state.sensors, newSensorState]
            };
            return ctx.dispatch(new SetCreateFloorPlanState(newState));   
        } catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(RemoveSensor)
    async removeSensor(ctx: StateContext<FloorPlanEditorStateModel>, { sensorId }: RemoveSensor) {
        try {
            const state = ctx.getState();
            const newState = {
                ...state,
                sensors: state.sensors.filter((sensor: ISensorState) => sensor.object.getAttr('customId') !== sensorId)
            };
            return ctx.dispatch(new SetCreateFloorPlanState(newState));
        } catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(UpdateSensorLinkedStatus)
    async updateSensorLinkedStatus(ctx: StateContext<FloorPlanEditorStateModel>, { sensorId, isLinked }: UpdateSensorLinkedStatus) {
        try {
            const state = ctx.getState();
            const newState = {
                ...state,
                sensors: state.sensors.map((sensor: ISensorState) => {
                    if (sensor.object.getAttr('customId') === sensorId) {
                        return {
                            ...sensor,
                            isLinked
                        }
                    }
                    return sensor;
                })
            };
            return ctx.dispatch(new SetCreateFloorPlanState(newState));
        } catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }

    @Action(UpdateActiveSensor)
    async updateActiveSensor(ctx: StateContext<FloorPlanEditorStateModel>, { sensorId }: UpdateActiveSensor) {
        try {
            const state = ctx.getState();
            const newState = {
                ...state,
                activeSensor: state.sensors.find((sensor: ISensorState) => sensor.object.getAttr('customId') === sensorId) || null
            };

            return ctx.dispatch(new SetCreateFloorPlanState(newState));
        } catch (error) {
            return ctx.dispatch(new SetError((error as Error).message));
        }
    }
}

export class AddSensor {
    static readonly type = '[CreateFloorPlan] AddSensor';
    constructor(public sensor: Konva.Circle) {}
}

export class RemoveSensor {
    static readonly type = '[CreateFloorPlan] RemoveSensor';
    constructor(public sensorId: string) {}
}

export class SetCreateFloorPlanState {
    static readonly type = '[CreateFloorPlan] SetCreateFloorPlanState';
    constructor(public payload: any) {}
}

export class SetSensors {
    static readonly type = '[CreateFloorPlan] SetSensors';
    constructor(public payload: ISensorState[]) {}
}

export class UpdateActiveSensor {
    static readonly type = '[CreateFloorPlan] UpdateActiveSensor';
    constructor(public sensorId: string) {}
}

export class UpdateSensorLinkedStatus {
    static readonly type = '[CreateFloorPlan] UpdateSensorLinkedStatus';
    constructor(public sensorId: string, public isLinked: boolean) {}
}

export class SetError {
    static readonly type = '[Error] Set Error';
    constructor(public readonly error: string | null) {}
}