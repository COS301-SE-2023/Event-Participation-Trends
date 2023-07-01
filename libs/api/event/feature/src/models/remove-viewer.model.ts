import { 
    IRemoveViewer, 
    RemoveViewerFromEventEvent, 
    RemoveEventFromViewerEvent,
    } from '@event-participation-trends/api/event/util';
import { Types } from 'mongoose';
import { AggregateRoot } from '@nestjs/cqrs';

export class RemoveViewer extends AggregateRoot implements IRemoveViewer {
    constructor(
        public userEmail?: string | undefined | null,
	    public eventId?: Types.ObjectId | undefined | null,
    ){
        super();
    }

    removeViewer() {
        this.apply(new RemoveViewerFromEventEvent(this.toJSON()));
    }

    removeEvent() {
        this.apply(new RemoveEventFromViewerEvent(this.toJSON()));
    }

    static fromData(event: IRemoveViewer): RemoveViewer {
        const instance = new RemoveViewer(
            event.userEmail,
            event.eventId
        );
        return instance;
    }

    toJSON(): IRemoveViewer {
        return {
            userEmail: this.userEmail,
            eventId: this.eventId
        };
    }
}