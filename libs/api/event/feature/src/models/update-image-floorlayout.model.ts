import { 
    IUpdateFloorLayoutImage,
    UpdateEventFloorLayoutImgEvent,
    } from '@event-participation-trends/api/event/util';
import { Types } from 'mongoose';
import { AggregateRoot } from '@nestjs/cqrs';

export class UpdateFloorLayoutImage extends AggregateRoot implements IUpdateFloorLayoutImage {
    constructor(
        public eventId: Types.ObjectId | undefined | null,
        public imageId: Types.ObjectId | undefined | null,
        public managerEmail: string | undefined | null,
        public imgBase64: string | undefined | null,
        public imageObj: string | undefined | null,
        public imageScale: number | undefined | null,
        public imageType: string | undefined | null,
    ){
        super();
    }

    update(){
        this.apply(new UpdateEventFloorLayoutImgEvent(this.toJSON()));
    }

    static fromData(event: IUpdateFloorLayoutImage): UpdateFloorLayoutImage {
        const instance = new UpdateFloorLayoutImage(
            event.eventId,
            event.imageId,
            event.managerEmail,
            event.imgBase64,
            event.imageObj,
            event.imageScale,
            event.imageType,
        );
        return instance;
    }

    toJSON(): IUpdateFloorLayoutImage {
        return {
            eventId: this.eventId,
            imageId: this.imageId,
            managerEmail: this.managerEmail,
            imgBase64: this.imgBase64,
            imageObj: this.imageObj,
            imageScale: this.imageScale,
            imageType: this.imageType,
        };
    }
}