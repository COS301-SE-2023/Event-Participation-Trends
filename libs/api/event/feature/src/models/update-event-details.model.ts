import { 
    IUpdateEventDetails,
    UpdateEventDetialsEvent,
    UpdateFloorlayoutEvent
    } from '@event-participation-trends/api/event/util';
import {
    IEventLocation,
} from '@event-participation-trends/api/event/util';
import { Types } from 'mongoose';
import { AggregateRoot } from '@nestjs/cqrs';

export class UpdateEventDetails extends AggregateRoot implements IUpdateEventDetails {
    constructor(
        public EventId?: Types.ObjectId | undefined | null,
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

    update(){
        this.apply(new UpdateEventDetialsEvent(this.toJSON()));
    }

    updateFloorlayout(){
        this.apply(new UpdateFloorlayoutEvent(this.toJSON()));
    }

    static fromData(event: IUpdateEventDetails): UpdateEventDetails {
        const instance = new UpdateEventDetails(
            event.EventId,
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

    toJSON(): IUpdateEventDetails {
        return {
            EventId: this.EventId,
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