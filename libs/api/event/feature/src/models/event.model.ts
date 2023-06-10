import { 
    IEvent, 
    CreateEventEvent, 
    } from '@event-participation-trends/api/event/util';
import {
    IDevice,
    IEventLocation,
    IFloorLayout,
    IStall,
    ISensor,
    ITEMP_DEVICE_TO_DT,
    ITEMP_DEVICE_BUFFER,
} from '@event-participation-trends/api/event/util';
import {Types } from 'mongoose';
import { IUser } from '@event-participation-trends/api/user/util';
import { AggregateRoot } from '@nestjs/cqrs';

export class Event extends AggregateRoot implements IEvent {
    constructor(
        public StartDate?: Date | undefined | null,
        public EndDate?: Date | undefined | null,
        public Name?: string | undefined | null,
        public Category?: string | undefined | null,
        public Location?: IEventLocation | undefined | null,
        public thisFloorLayout?: IFloorLayout | undefined | null,
        public Stalls?: IStall[] | undefined | null,
        public Sensors?: ISensor[] | undefined | null,
        public Devices?: IDevice[] | undefined | null,
        public BTIDtoDeviceBuffer?: ITEMP_DEVICE_TO_DT[] | undefined | null,
        public TEMPBuffer?: ITEMP_DEVICE_BUFFER[] | undefined | null,
        public Manager?: Types.ObjectId | undefined | null,
        public Requesters?: IUser[] | undefined | null,
        public Viewers?: IUser[] | undefined | null,
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
            event.thisFloorLayout,
            event.Stalls,
            event.Sensors,
            event.Devices,
            event.BTIDtoDeviceBuffer,
            event.TEMPBuffer,
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
            thisFloorLayout: this.thisFloorLayout,
            Stalls: this.Stalls,
            Sensors: this.Sensors,
            Devices: this.Devices,
            BTIDtoDeviceBuffer: this.BTIDtoDeviceBuffer,
            TEMPBuffer: this.TEMPBuffer,
            Manager: this.Manager,
            Requesters: this.Requesters,
            Viewers: this.Viewers,
        };
    }
}