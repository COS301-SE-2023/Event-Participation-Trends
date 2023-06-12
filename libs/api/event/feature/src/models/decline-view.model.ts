import { 
    IDecelineView, 
    DeclineViewRequestEvent, 
    } from '@event-participation-trends/api/event/util';
import { AggregateRoot } from '@nestjs/cqrs';
import { Types } from 'mongoose';

export class DecelineView extends AggregateRoot implements IDecelineView {
    constructor(
        public userEmail?: string | undefined | null,
        public eventId?: Types.ObjectId | undefined | null
    ){
        super();
    }

    create() {
        this.apply(new DeclineViewRequestEvent(this.toJSON()));
    }

    static fromData(event: IDecelineView): DecelineView {
        const instance = new DecelineView(
            event.userEmail,
            event.eventId,
        );
        return instance;
    }

    toJSON(): IDecelineView {
        return {
            userEmail: this.userEmail,
            eventId: this.eventId
        };
    }
}