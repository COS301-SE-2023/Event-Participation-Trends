import { CreateStallEvent, IEventId, IStall } from "@event-participation-trends/api/event/util";
import { AggregateRoot } from "@nestjs/cqrs";

export class Stall extends AggregateRoot implements IStall {
    constructor(
        public EventId?: IEventId | undefined | null,
        public Name?: string | undefined | null,
        public x_coordinate?: number | undefined | null,
        public y_coordinate?: number | undefined | null,
        public width?: number | undefined | null,
        public height?: number | undefined | null,
    ){
        super();
    }

    create() {
        this.apply(new CreateStallEvent(this.toJSON()));
    }

    static fromData(stall: IStall): Stall {
        const instance = new Stall(
            stall.EventId,
            stall.Name,
            stall.x_coordinate,
            stall.y_coordinate,
            stall.width,
            stall.height,
        );
        return instance;
    }

    toJSON(): IStall {
        return {
            Name: this.Name,
            x_coordinate: this.x_coordinate,
            y_coordinate: this.y_coordinate,
            width: this.width,
            height: this.height,
        };
    }
}