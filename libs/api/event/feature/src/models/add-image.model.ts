import { 
    IAddImageToEvent, 
    AddImageToEventEvent,
    DeleteEventImageEvent,
    RemoveEventImageEvent,
    } from '@event-participation-trends/api/event/util';
import { AggregateRoot } from '@nestjs/cqrs';
import { Types } from 'mongoose';

export class AddImageToEvent extends AggregateRoot implements IAddImageToEvent {
    constructor(
        public eventId: Types.ObjectId | undefined | null,
        public imageId:  Types.ObjectId | undefined | null,
    ){
        super();
    }

    add() {
        this.apply(new AddImageToEventEvent(this.toJSON()));
    }

    deleteImage() {
        this.apply(new DeleteEventImageEvent(this.toJSON()));
    }

    deleteImageFromEvent(){
        this.apply(new RemoveEventImageEvent(this.toJSON()));
    }

    static fromData(image: IAddImageToEvent): AddImageToEvent {
        const instance = new AddImageToEvent(
            image.eventId,
            image.imageId,
        );
        return instance;
    }

    toJSON(): IAddImageToEvent {
        return {
            eventId: this.eventId,
            imageId: this.imageId,
        };
    }
}