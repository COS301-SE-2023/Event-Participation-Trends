import { 
    IGlobal, 
    ISensorIdToMac,
    CreateGlobalEvent,
    } from '@event-participation-trends/api/global/util';
import { AggregateRoot } from '@nestjs/cqrs';

export class Global extends AggregateRoot implements IGlobal {
    constructor(
        public SensorIdToMacs: ISensorIdToMac[] | undefined | null,
    ){
        super();
    }

    create() {
        this.apply(new CreateGlobalEvent(this.toJSON()));
    }

    static fromData(event: IGlobal): Global {
        const instance = new Global(
            event.SensorIdToMacs,
        );
        return instance;
    }

    toJSON(): IGlobal {
        return {
            SensorIdToMacs: this.SensorIdToMacs,
        };
    }
}