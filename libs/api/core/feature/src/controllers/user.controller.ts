import { UserService } from '@event-participation-trends/api/user/feature';
import {
    ICreateUserRequest,
    ICreateUserResponse,
    IGetUsersRequest,
    IGetUsersResponse,
    IUpdateRoleRequest,
    IupdateRoleResponse,
} from '@event-participation-trends/api/user/util';
import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '@event-participation-trends/guards';

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

    @Get('lol')
    @UseGuards(JwtGuard)
    async lol(@Req() req: Request) {
        const request: any = req;
        return request.user;
    }
}