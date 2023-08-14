import { EventRepository } from "@event-participation-trends/api/event/data-access";
import { GetManagedEventCategoriesQuery, IGetManagedEventCategoriesResponse } from "@event-participation-trends/api/event/util";
import { UserRepository } from "@event-participation-trends/api/user/data-access";
import { Role } from "@event-participation-trends/api/user/util";
import { HttpException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetManagedEventCategoriesQuery)
export class GetManagedEventCategoriesHandler implements IQueryHandler<GetManagedEventCategoriesQuery, IGetManagedEventCategoriesResponse>{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly eventRepository: EventRepository,
    ) {}

    async execute(query: GetManagedEventCategoriesQuery) {
        console.log(`${GetManagedEventCategoriesHandler.name}`);
        const request = query.request;
        
        if(request.ManagerEmail != null && request.ManagerEmail != undefined){
            const managerDoc = await this.userRepository.getUser(request.ManagerEmail);
            if(managerDoc.length == 0)
            throw new HttpException(`Bad Request: user with email ${request.ManagerEmail} does not exist in DB`, 400);
            else {
                if(managerDoc[0].Role === Role.MANAGER){
                    const eventCategoriesDoc = await this.eventRepository.getManagedEventCategories(managerDoc[0]._id);
                    if(eventCategoriesDoc.length == 0)
                        return {categories: <string[]>[]};
                    else
                        return {categories: <string[]> <unknown> eventCategoriesDoc};
                }else{
                    return {categories: <string[]>[]};
                }
            }
        }else{
            return {categories: <string[]>[]};
        }
    }
    
}