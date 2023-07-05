import { 
    IAddDevicePosition, 
    AddDevicePositionEvent,
    IPosition,
    } from '@event-participation-trends/api/event/util';
import { AggregateRoot } from '@nestjs/cqrs';

export class AddDevicePosition extends AggregateRoot implements IAddDevicePosition {
    constructor(
        public eventId: string | undefined | null,
        public position: IPosition | undefined | null,
    ){
        super();
    }

    add() {
        this.apply(new AddDevicePositionEvent(this.toJSON()));
    }

    static fromData(event: IAddDevicePosition): AddDevicePosition {
        const instance = new AddDevicePosition(
            event.eventId,
            event.position,
        );
        return instance;
    }

    toJSON(): IAddDevicePosition {
        return {
            eventId: this.eventId,
            position: this.position,
        };
    }
}