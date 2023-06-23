import { UserService } from '@event-participation-trends/api/user/feature';
import {
    IGetUsersRequest,
    IGetUsersResponse,
    IUpdateRoleRequest,
    IupdateRoleResponse,
    Role,
} from '@event-participation-trends/api/user/util';
import { Body, Controller, Post, Get, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard, RbacGuard, CsrfGuard } from '@event-participation-trends/api/guards';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Get('getAllUsers')
    @SetMetadata('role',Role.ADMIN)
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
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
    @SetMetadata('role',Role.ADMIN)
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
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

    @Get('getRole')
    @SetMetadata('role',Role.VIEWER)
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
    async getRole(
        @Req() req: Request,
    ): Promise<Role> {
        const request: any =req;
        return request.user["role"];
    }
}