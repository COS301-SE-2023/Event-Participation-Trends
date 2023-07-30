import { 
    IEventDetails, 
    CreateEventEvent, 
    UpdateFloorlayoutEvent,
    } from '@event-participation-trends/api/event/util';
import {
    IEventLocation,
} from '@event-participation-trends/api/event/util';
import { Types } from 'mongoose';
import { AggregateRoot } from '@nestjs/cqrs';

export class EventDetails extends AggregateRoot implements IEventDetails {
    constructor(
        public StartDate?: Date | undefined | null,
        public EndDate?: Date | undefined | null,
        public Name?: string | undefined | null,
        public Category?: string | undefined | null,
        public Location?: IEventLocation | undefined | null,
        public Manager?: Types.ObjectId | undefined | null,
        public Floorlayout?: string | undefined | null,
    ){
        super();
    }

    create() {
        this.apply(new CreateEventEvent(this.toJSON()));
    }

    update(){
        this.apply(new UpdateFloorlayoutEvent(this.toJSON()));
    }

    static fromData(event: IEventDetails): EventDetails {
        const instance = new EventDetails(
            event.StartDate,
            event.EndDate,
            event.Name,
            event.Category,
            event.Location,
            event.Manager,
            event.Floorlayout,
        );
        return instance;
    }

    toJSON(): IEventDetails {
        return {
            StartDate: this.StartDate,
            EndDate: this.EndDate,
            Name: this.Name,
            Category: this.Category,
            Location: this.Location,
            Manager: this.Manager,
            Floorlayout: this.Floorlayout,
        };
    }
}