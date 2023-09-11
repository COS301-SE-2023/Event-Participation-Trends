import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { GetEventStatisticsQuery, IGetEventStatisticsResponse } from '@event-participation-trends/api/event/util';
import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';

@QueryHandler(GetEventStatisticsQuery)
export class GetEventStatisticsHandler implements IQueryHandler<GetEventStatisticsQuery, IGetEventStatisticsResponse> {
    constructor(
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository,
    ) {}
    
    async execute(query: GetEventStatisticsQuery) {

        const eventIdObj = <Types.ObjectId> <unknown> query.request.eventId;
        const devices =  await this.eventRepository.getDevicePosotions(eventIdObj);

        let total_attendance =0;
        let average_attendance =0;
        let peak_attendance= 0;
        let turnover_rate =0;
        let average_attendance_time =0;
        let max_attendance_time =0;

        //compute statistics begin

        //compute statistics end

        return <IGetEventStatisticsResponse> {
            total_attendance: total_attendance,
            average_attendance: average_attendance,
            peak_attendance: peak_attendance,
            turnover_rate: turnover_rate,
            average_attendance_time: average_attendance_time,
            max_attendance_time: max_attendance_time,
        }
    }

}