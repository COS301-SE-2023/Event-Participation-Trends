import { 
    IEvent, 
    CreateEventEvent,
    IFloorLayout, 
    } from '@event-participation-trends/api/event/util';
import {
    IDevice,
    IEventLocation,
    IStall,
    ISensor,
} from '@event-participation-trends/api/event/util';
import {Types } from 'mongoose';
import { AggregateRoot } from '@nestjs/cqrs';

export class Event extends AggregateRoot implements IEvent {
    constructor(
        public StartDate?: Date | undefined | null,
        public EndDate?: Date | undefined | null,
        public Name?: string | undefined | null,
        public Category?: string | undefined | null,
        public Location?: IEventLocation | undefined | null,
        public FloorLayout?: IFloorLayout | undefined | null,
        public Stalls?: IStall[] | undefined | null,
        public Sensors?: ISensor[] | undefined | null,
        public Devices?: IDevice[] | undefined | null,
        public Manager?: Types.ObjectId | undefined | null,
        public Requesters?: Types.ObjectId[] | undefined | null,
        public Viewers?: Types.ObjectId[] | undefined | null,
    ){
        super();
    }

    create() {
        this.apply(new CreateEventEvent(this.toJSON()));
    }

    static fromData(event: IEvent): Event {
        const instance = new Event(
            event.StartDate,
            event.EndDate,
            event.Name,
            event.Category,
            event.Location,
            event.FloorLayout,
            event.Stalls,
            event.Sensors,
            event.Devices,
            event.Manager,
            event.Requesters,
            event.Viewers,
        );
        return instance;
    }

    toJSON(): IEvent {
        return {
            StartDate: this.StartDate,
            EndDate: this.EndDate,
            Name: this.Name,
            Category: this.Category,
            Location: this.Location,
            FloorLayout: this.FloorLayout,
            Stalls: this.Stalls,
            Sensors: this.Sensors,
            Devices: this.Devices,
            Manager: this.Manager,
            Requesters: this.Requesters,
            Viewers: this.Viewers,
        };
    }
}