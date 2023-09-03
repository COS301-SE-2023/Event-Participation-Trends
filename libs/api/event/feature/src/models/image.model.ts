import { 
    IImage, 
    UploadImageEvent
    } from '@event-participation-trends/api/event/util';
import { AggregateRoot } from '@nestjs/cqrs';
import { Types } from 'mongoose';

export class Image extends AggregateRoot implements IImage {
    constructor(
        public eventId: Types.ObjectId | undefined | null,
        public imageBase64:  string | undefined | null,
    ){
        super();
    }

    add() {
        this.apply(new UploadImageEvent(this.toJSON()));
    }

    static fromData(image: IImage): Image {
        const instance = new Image(
            image.eventId,
            image.imageBase64,
        );
        return instance;
    }

    toJSON(): IImage {
        return {
            eventId: this.eventId,
            imageBase64: this.imageBase64,
        };
    }
}