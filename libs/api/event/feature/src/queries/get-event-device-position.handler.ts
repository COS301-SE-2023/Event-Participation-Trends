import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetEventDevicePositionQuery, IGetEventDevicePositionResponse } from '@event-participation-trends/api/event/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { IPosition, Position } from '@event-participation-trends/api/event/util';
import { Types } from 'mongoose';

@QueryHandler(GetEventDevicePositionQuery)
export class GetEventDevicePositionHandler implements IQueryHandler<GetEventDevicePositionQuery, IGetEventDevicePositionResponse> {
    constructor(
        private readonly eventRepository: EventRepository,
    ) {}

    async execute(query: GetEventDevicePositionQuery) {
        console.log(`${GetEventDevicePositionHandler.name}`);
        const request = query.request;
        const eventIdObj = <Types.ObjectId> <unknown> request.eventId;

        const deviceDoc = await this.eventRepository.getDevicePosotions(eventIdObj);
        // eslint-disable-next-line prefer-const
        let positions = new Array<Position>();

        const startTimeDate = new Date(request.startTime||"");
        const endTimeDate = new Date(request.endTime||"");

        deviceDoc[0].Devices?.forEach(element=>{
            // eslint-disable-next-line prefer-const
            let timestampDate= new Date(element.timestamp || "");
            if( timestampDate>= startTimeDate && timestampDate <= endTimeDate){
                positions.push(element);
            }
        })

        return {positions: <IPosition[]>positions};
    }
}