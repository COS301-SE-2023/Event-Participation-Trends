import { IEvent } from "@event-participation-trends/api/event/util";

export class SetCanCreateFloorPlan {
    static readonly type = '[AddEvent] SetCanCreateFloorPlan';
    constructor(public value: boolean) {}
}

export class SetNewlyCreatedEvent {
    static readonly type = '[AddEvent] SetNewlyCreatedEvent';
    constructor(public event: IEvent) {}
}