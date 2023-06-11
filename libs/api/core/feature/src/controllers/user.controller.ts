import { UserService } from '@event-participation-trends/api/user/feature';
import {
    ICreateUserRequest,
    ICreateUserResponse,
    IGetUsersRequest,
    IGetUsersResponse,
    IUpdateRoleRequest,
    IupdateRoleResponse,
} from '@event-participation-trends/api/user/util';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Post('createUser')
    async createUser(
        @Body() request: ICreateUserRequest,
    ): Promise<ICreateUserResponse> {
        return this.userService.createUser(request);
    }

    @Post('getAllUsers')
    async getAllUsers(
        @Body() request: IGetUsersRequest,
    ): Promise<IGetUsersResponse> {
        return this.userService.getUsers(request);
    }

    @Post('updateUserRole')
    async updateUserRole(
        @Body() request: IUpdateRoleRequest,
    ): Promise<IupdateRoleResponse> {
        return this.userService.updateUserRole(request);
    }
}