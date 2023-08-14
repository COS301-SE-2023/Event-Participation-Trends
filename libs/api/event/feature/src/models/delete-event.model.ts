import { 
    IDeleteEvent, 
    DeleteEventEvent, 
    RemoveEventFromViewersEvent,
    } from '@event-participation-trends/api/event/util';
import { Types } from 'mongoose';
import { AggregateRoot } from '@nestjs/cqrs';

export class DeleteEvent extends AggregateRoot implements IDeleteEvent {
    constructor(
        public managerId?: Types.ObjectId | undefined | null,
        public eventId?: Types.ObjectId | undefined | null,
        public Viewers?: Types.ObjectId[] | undefined | null,
    ){
        super();
    }

    deleteEvent() {
        this.apply(new DeleteEventEvent(this.toJSON()));
    }

    deleteFromViewers() {
        this.apply(new RemoveEventFromViewersEvent(this.toJSON()));
    }

    static fromData(event: IDeleteEvent): DeleteEvent {
        const instance = new DeleteEvent(
            event.managerId,
            event.eventId,
            event.Viewers,
        );
        return instance;
    }

    toJSON(): IDeleteEvent {
        return {
            managerId: this.managerId,
            eventId: this.eventId,
            Viewers: this.Viewers,
        };
    }
}