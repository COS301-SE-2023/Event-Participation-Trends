import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { GetUsersQuery, Role, IGetUsersResponse } from '@event-participation-trends/api/user/util';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery, IGetUsersResponse> {
    constructor(private readonly repository: UserRepository) {}

    async execute(query: GetUsersQuery) {
        console.log(`${GetUsersHandler.name}`);

        const userDocs = await this.repository.getAllUsers();
        return {users: userDocs};
    }
}