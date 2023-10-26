import {
    IViewRequest,
    DeclineViewRequestEvent,
    AcceptViewRequestEvent,
    } from '@event-participation-trends/api/event/util';
import { AggregateRoot } from '@nestjs/cqrs';
import { Types } from 'mongoose';

export class ViewRequest extends AggregateRoot implements IViewRequest {
    constructor(
        public userEmail?: string | undefined | null,
        public eventId?: Types.ObjectId | undefined | null
    ){
        super();
    }

    decline() {
        this.apply(new DeclineViewRequestEvent(this.toJSON()));
    }

    accept() {
        this.apply(new AcceptViewRequestEvent(this.toJSON()));
    }

    static fromData(event: IViewRequest): ViewRequest {
        const instance = new ViewRequest(
            event.userEmail,
            event.eventId,
        );
        return instance;
    }

    toJSON(): IViewRequest {
        return {
            userEmail: this.userEmail,
            eventId: this.eventId
        };
    }
}