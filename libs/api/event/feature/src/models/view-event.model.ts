import { 
    IViewEvent, 
    SendViewRequestEvent, 
    AddViewerEvent
    } from '@event-participation-trends/api/event/util';
import { Types } from 'mongoose';
import { AggregateRoot } from '@nestjs/cqrs';

export class ViewEvent extends AggregateRoot implements IViewEvent {
    constructor(
        public UserEmail?: string | undefined | null,
	    public eventId?: Types.ObjectId,
    ){
        super();
    }

    create() {
        this.apply(new SendViewRequestEvent(this.toJSON()));
    }

    add() {
        this.apply(new AddViewerEvent(this.toJSON()));
    }

    static fromData(event: IViewEvent): ViewEvent {
        const instance = new ViewEvent(
            event.UserEmail,
            event.eventId
        );
        return instance;
    }

    toJSON(): IViewEvent {
        return {
            UserEmail: this.UserEmail,
            eventId: this.eventId
        };
    }
}