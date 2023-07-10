import { CreateFloorPlanStateModel } from "@event-participation-trends/app/createfloorplan/data-access";

export class SetCreateFloorPlanState {
    static readonly type = '[CreateFloorPlan] SetCreateFloorPlanState';
    constructor(public payload: CreateFloorPlanStateModel) {}
}

export class SetSensors {
    static readonly type = '[CreateFloorPlan] SetSensors';
    constructor(public payload: CreateFloorPlanStateModel['sensors']) {}
}
export class AddSensor {
    static readonly type = '[CreateFloorPlan] AddSensor';
    constructor(public payload: CreateFloorPlanStateModel['sensors'][0]) {}
}

export class RemoveSensor {
    static readonly type = '[CreateFloorPlan] RemoveSensor';
    constructor(public sensorId: string) {}
}