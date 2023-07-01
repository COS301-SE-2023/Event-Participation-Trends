import {
    ICreateUserRequest,
    ICreateUserResponse,
    CreateUserCommand,
    IGetUsersRequest,
    IGetUsersResponse,
    GetUsersQuery,
    IUpdateRoleRequest,
    IupdateRoleResponse,
    UpdateUserRoleCommand,
    IGetUserRoleRequest,
    IGetUserRoleResponse,
    GetUserRoleQuery,
    IAddViewingEventRequest,
    IAddViewingEventResponse,
    AddViewingEventCommand
} from '@event-participation-trends/api/user/util';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class UserService {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

    async getUsers(request: IGetUsersRequest) {
        return await this.queryBus.execute<GetUsersQuery, IGetUsersResponse>(new GetUsersQuery(request));
    }

    async createUser(request: ICreateUserRequest) {
        return await this.commandBus.execute<CreateUserCommand, ICreateUserResponse>(new CreateUserCommand(request));
    }

    async updateUserRole(request: IUpdateRoleRequest) {
        return await this.commandBus.execute<UpdateUserRoleCommand, IupdateRoleResponse>(new UpdateUserRoleCommand(request));
    }

    async getUserRole(request: IGetUserRoleRequest) {
        return await this.queryBus.execute<GetUserRoleQuery, IGetUserRoleResponse>(new GetUserRoleQuery(request));
    }

    async addViewingEvent(request: IAddViewingEventRequest) {
        return await this.commandBus.execute<AddViewingEventCommand, IAddViewingEventResponse>(new AddViewingEventCommand(request));
    }
}