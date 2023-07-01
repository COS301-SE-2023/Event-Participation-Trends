import { 
    ICreateWall, 
    CreateWallEvent,
    IWall
    } from '@event-participation-trends/api/event/util';
import { AggregateRoot } from '@nestjs/cqrs';

export class CreateWall extends AggregateRoot implements ICreateWall {
    constructor(
        public eventId: string | undefined | null,
        public Wall: IWall | undefined | null,
    ){
        super();
    }

    static fromData(event: ICreateWall): CreateWall {
        const instance = new CreateWall(
            event.eventId,
            event.Wall,
        );
        return instance;
    }

    create() {
        this.apply(new CreateWallEvent(this.toJSON()));
    }

    toJSON(): ICreateWall {
        return {
            eventId: this.eventId,
            Wall: this.Wall
        };
    }

}