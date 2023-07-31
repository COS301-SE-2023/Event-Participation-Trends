import Konva from "konva";

interface ISensorState {
    object: Konva.Circle,
    isLinked: boolean,
}

export class SetCreateFloorPlanState {
    static readonly type = '[CreateFloorPlan] SetCreateFloorPlanState';
    constructor(public payload: any) {}
}

export class SetSensors {
    static readonly type = '[CreateFloorPlan] SetSensors';
    constructor(public payload: ISensorState[]) {}
}
export class AddSensor {
    static readonly type = '[CreateFloorPlan] AddSensor';
    constructor(public sensor: Konva.Circle) {}
}

export class RemoveSensor {
    static readonly type = '[CreateFloorPlan] RemoveSensor';
    constructor(public sensorId: string) {}
}

export class UpdateSensorLinkedStatus {
    static readonly type = '[CreateFloorPlan] UpdateSensorLinkedStatus';
    constructor(public sensorId: string, public isLinked: boolean) {}
}

export class UpdateActiveSensor {
    static readonly type = '[CreateFloorPlan] UpdateActiveSensor';
    constructor(public sensorId: string) {}
}