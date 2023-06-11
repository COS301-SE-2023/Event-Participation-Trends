import { UserService } from '@event-participation-trends/api/user/feature';
import {
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

    @Get('getAllUsers')
    @UseGuards(JwtGuard)
    async getAllUsers(
        @Req() req: Request,
    ): Promise<IGetUsersResponse> {
        const request: any =req;
        const extractRequest: IGetUsersRequest = {
            AdminEmail: request.user["email"]
        }
        return this.userService.getUsers(extractRequest);
    }

    @Post('updateUserRole')
    @UseGuards(JwtGuard)
    async updateUserRole(
        @Req() req: Request,
        @Body() requestBody: IUpdateRoleRequest,
    ): Promise<IupdateRoleResponse> {
        const request: any =req;
        console.log(request.user["email"])
        const extractRequest: IUpdateRoleRequest = {
            update: {
                AdminEmail: request.user["email"],
                UserEmail: requestBody.update.UserEmail,
                UpdateRole: requestBody.update.UpdateRole
            }
        }
        return this.userService.updateUserRole(extractRequest);
    }

}