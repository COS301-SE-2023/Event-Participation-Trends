import { UserService } from '@event-participation-trends/api/user/feature';
import {
    IGetEmailResponse,
    IGetFullNameResponse,
    IGetProfilePicUrlResponse,
    IGetUserNameResponse,
    IGetUserRoleResponse,
  IGetUsersRequest,
  IGetUsersResponse,
  IUpdateRoleRequest,
  IupdateRoleResponse,
  Role,
} from '@event-participation-trends/api/user/util';
import { Body, Controller, Post, Get, UseGuards, Req, SetMetadata, HttpException } from '@nestjs/common';
import { Request } from 'express';
import {
  JwtGuard,
  RbacGuard,
  CsrfGuard,
} from '@event-participation-trends/api/guards';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
    @Get('getAllUsers')
    @SetMetadata('role',Role.ADMIN)
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
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
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
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

  @Get('getRole')
  @SetMetadata('role', Role.VIEWER)
  @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
  async getRole(@Req() req: Request): Promise<IGetUserRoleResponse> {
    const request: any = req;
    return {
        userRole: request.user['role'],
    };
    }

    @Get('getUserName')
    @SetMetadata('role', Role.VIEWER)
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
    async getUserName(@Req() req: Request): Promise<IGetUserNameResponse> {
        const request: any = req;
        return {
            username: request.user['firstName'],
        };
    }

    @Get('getProfilePicUrl')
    @SetMetadata('role', Role.VIEWER)
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
    async getProfilePhotoLink(@Req() req: Request): Promise<IGetProfilePicUrlResponse> {
        const request: any = req;
        return {
            url: request.user['picture'],
        };
    }

    @Get('getFullName')
    @SetMetadata('role', Role.VIEWER)
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
    async getFullName(@Req() req: Request): Promise<IGetFullNameResponse> {
        const request: any = req;
        if (request.user['lastName'] == undefined) {
            return {
                fullName: request.user['firstName'],
            };
        }
        return {
            fullName: request.user['firstName'] + ' ' + request.user['lastName'],
        };
    }

    @Get('getEmail')
    @SetMetadata('role', Role.VIEWER)
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
    async getEmail(@Req() req: Request): Promise<IGetEmailResponse> {
        const request: any = req;
        return {
            email: request.user['email'],
        };
    }
}
