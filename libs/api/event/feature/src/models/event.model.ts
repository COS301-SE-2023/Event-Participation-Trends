import { 
    IEvent, 
    CreateEventEvent, 
    } from '@event-participation-trends/api/event/util';
import {
    IDevice,
    IEventLocation,
    IStall,
    ISensor,
    IMqttDataInterface
} from '@event-participation-trends/api/event/util';
import {Types } from 'mongoose';
import { AggregateRoot } from '@nestjs/cqrs';
import { IMacToId } from '@event-participation-trends/api/event/data-access';

export class Event extends AggregateRoot implements IEvent {
    constructor(
        public StartDate?: Date | undefined | null,
        public EndDate?: Date | undefined | null,
        public Name?: string | undefined | null,
        public Category?: string | undefined | null,
        public Location?: IEventLocation | undefined | null,
        //public thisFloorLayout?: IFloorLayout | undefined | null,
        public Stalls?: IStall[] | undefined | null,
        public Sensors?: ISensor[] | undefined | null,
        public Devices?: IDevice[] | undefined | null,
        public BTIDtoDeviceBuffer?: IMacToId[] | undefined | null,
        public TEMPBuffer?: IMqttDataInterface[] | undefined | null,
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
            //event.thisFloorLayout,
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
           // thisFloorLayout: this.thisFloorLayout,
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