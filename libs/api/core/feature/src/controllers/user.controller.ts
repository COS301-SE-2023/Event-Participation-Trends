import { UserService } from '@event-participation-trends/api/user/feature';
import {
    IGetUsersRequest,
    IGetUsersResponse,
    IUpdateRoleRequest,
    IupdateRoleResponse,
    Role,
} from '@event-participation-trends/api/user/util';
import { Body, Controller, Post, Get, UseGuards, Req, SetMetadata, HttpException } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard, RbacGuard } from '@event-participation-trends/api/guards';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Get('getAllUsers')
    @SetMetadata('role',Role.ADMIN)
    @UseGuards(JwtGuard, RbacGuard)
    async getAllUsers(
        @Req() req: Request,
    ): Promise<IGetUsersResponse> {
        const request: any =req;

        if(request.user["email"]==undefined || request.user["email"]==null)
            throw new HttpException("Bad Request: admin email not provided", 400);

        const extractRequest: IGetUsersRequest = {
            AdminEmail: request.user["email"]
        }
        return this.userService.getUsers(extractRequest);
    }

    @Post('updateUserRole')
    @SetMetadata('role',Role.ADMIN)
    @UseGuards(JwtGuard, RbacGuard)
    async updateUserRole(
        @Req() req: Request,
        @Body() requestBody: IUpdateRoleRequest,
    ): Promise<IupdateRoleResponse> {
        const request: any =req;
        
        if(request.user["email"]==undefined || request.user["email"]==null)
            throw new HttpException("Bad Request: Admin email not provided", 400);

        if(requestBody.update.UserEmail==undefined || requestBody.update.UserEmail ==null)
            throw new HttpException("Bad Request: User email not provided", 400);

        if(requestBody.update.UpdateRole==undefined || requestBody.update.UpdateRole ==null)
            throw new HttpException("Bad Request: role not provided", 400);

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