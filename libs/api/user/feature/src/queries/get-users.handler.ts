import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { GetUsersQuery, Role, IGetUsersResponse } from '@event-participation-trends/api/user/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';


@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery, IGetUsersResponse> {
    constructor(private readonly repository: UserRepository) {}

    async execute(query: GetUsersQuery) {
        console.log(`${GetUsersHandler.name}`);
        const request = query.request;

        if (!request.AdminEmail || !request.userRole)
            throw new Error('Missing required field: AdminEmail');
        
        const AdminDoc = await this.repository.getUser(request.AdminEmail);
        if(AdminDoc[0].Role === Role.ADMIN){
            const userDocs = await this.repository.getUsersByRole(request.userRole);
            return {users: userDocs};
        }else{
            throw new Error(`User with email ${request.AdminEmail} does not have admin Privileges`);
        }

    }
}