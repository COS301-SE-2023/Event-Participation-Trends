import { 
    IEvent, 
    CreateEventEvent,
    IFloorLayout, 
    } from '@event-participation-trends/api/event/util';
import {
    IStall,
    ISensor,
} from '@event-participation-trends/api/event/util';
import {Types } from 'mongoose';
import { AggregateRoot } from '@nestjs/cqrs';
import { IPosition } from '@event-participation-trends/api/event/data-access';

export class Event extends AggregateRoot implements IEvent {
    constructor(
        public StartDate?: Date | undefined | null,
        public EndDate?: Date | undefined | null,
        public Name?: string | undefined | null,
        public Category?: string | undefined | null,
        public Location?: string | undefined | null,
        public FloorLayout?: IFloorLayout | undefined | null,
        public FloorLayoutImg?: Types.ObjectId | undefined | null,
        public Stalls?: IStall[] | undefined | null,
        public Sensors?: ISensor[] | undefined | null,
        public Devices?: IPosition[] | undefined | null,
        public Manager?: Types.ObjectId | undefined | null,
        public Requesters?: Types.ObjectId[] | undefined | null,
        public Viewers?: Types.ObjectId[] | undefined | null,
        public PublicEvent?: boolean | undefined | null,
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
            event.FloorLayoutImg,
            event.Stalls,
            event.Sensors,
            event.Devices,
            event.Manager,
            event.Requesters,
            event.Viewers,
            event.PublicEvent
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
            FloorLayoutImg: this.FloorLayoutImg,
            Stalls: this.Stalls,
            Sensors: this.Sensors,
            Devices: this.Devices,
            Manager: this.Manager,
            Requesters: this.Requesters,
            Viewers: this.Viewers,
            PublicEvent: this.PublicEvent,
        };
    }
}