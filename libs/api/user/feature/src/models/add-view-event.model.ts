import { 
    IAddViewEvent, 
    AddViewingEventEvent, 
    AddEventToAdminEvent,
    } from '@event-participation-trends/api/user/util';
import { AggregateRoot } from '@nestjs/cqrs';

export class AddViewEvent extends AggregateRoot implements IAddViewEvent {
    constructor(
        public userEmail: string | undefined | null,
        public eventId: string | undefined | null,
    ){
        super();
    }

    add() {
        this.apply(new AddViewingEventEvent(this.toJSON()));
    }

    addToAdmin(){
        this.apply(new AddEventToAdminEvent(this.toJSON()));
    }

    static fromData(event: IAddViewEvent): AddViewEvent {
        const instance = new AddViewEvent(
          event.userEmail,
          event.eventId,
        );
    
        return instance;
    }

    toJSON(): IAddViewEvent {
        return {
            userEmail: this.userEmail,
            eventId: this.eventId,
        };
    }

}