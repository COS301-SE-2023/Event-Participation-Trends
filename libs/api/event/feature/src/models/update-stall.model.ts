import { IEventId, IUpdateStall, UpdateStallEvent } from "@event-participation-trends/api/event/util";
import { AggregateRoot } from "@nestjs/cqrs";

export class UpdateStall extends AggregateRoot implements IUpdateStall {
    constructor(
        public EventId: IEventId | undefined | null,
        public Name?: string | undefined | null,
        public x_coordinate?: number | undefined | null,
        public y_coordinate?: number | undefined | null,
        public width?: number | undefined | null,
        public height?: number | undefined | null,
    ) {
        super();
    }

    update() {
        this.apply(new UpdateStallEvent(this.toJSON()));
    }

    static fromData(stall: IUpdateStall): UpdateStall {
        const instance = new UpdateStall(
            stall.EventId,
            stall.Name,
            stall.x_coordinate,
            stall.y_coordinate,
            stall.width,
            stall.height,
        );
        return instance;
    }

    toJSON(): IUpdateStall {
        return {
            EventId: this.EventId,
            Name: this.Name,
            x_coordinate: this.x_coordinate,
            y_coordinate: this.y_coordinate,
            width: this.width,
            height: this.height,
        };
    }
}