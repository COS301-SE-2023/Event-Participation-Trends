import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { GetUserRoleQuery, IGetUserRoleResponse } from '@event-participation-trends/api/user/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';


@QueryHandler(GetUserRoleQuery)
export class GetUserRoleHandler implements IQueryHandler<GetUserRoleQuery, IGetUserRoleResponse> {
    constructor(private readonly repository: UserRepository) {}

    async execute(query: GetUserRoleQuery) {
        console.log(`${GetUserRoleHandler.name}`);
        const request = query.request;

        const userDoc = await this.repository.getUser(request.userEmail);

        const data: IGetUserRoleResponse={
            userRole : userDoc[0].Role
        }
        
        return data;
    }
}