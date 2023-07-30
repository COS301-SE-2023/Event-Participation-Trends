import { GlobalRepository, ISensorIdToMac } from '@event-participation-trends/api/global/data-access';
import { GetGlobalQuery, IGetGlobalResponse } from '@event-participation-trends/api/global/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';


@QueryHandler(GetGlobalQuery)
export class GetGlobalHandler implements IQueryHandler<GetGlobalQuery, IGetGlobalResponse> {
    constructor(
        private readonly globalRepository: GlobalRepository
    ) {}

    async execute(query: GetGlobalQuery) {
        console.log(`${GetGlobalHandler.name}`);
        const request = query.request;
        

        const globalDoc = await this.globalRepository.getGlobal();
        if(request.sensorIdToMacs && globalDoc.length !=0){
            return {sensorIdToMacs: <ISensorIdToMac[]>globalDoc[0].SensorIdToMacs};
        }else{
            return {sensorIdToMacs: <ISensorIdToMac[]>[]};
        }
        
    }
}