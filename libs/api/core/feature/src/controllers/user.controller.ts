import { UserService } from '@event-participation-trends/api/user/feature';
import {
    ICreateUserRequest,
    ICreateUserResponse,
} from '@event-participation-trends/api/user/util';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Post('createUser')
    async create(
        @Body() request: ICreateUserRequest,
    ): Promise<ICreateUserResponse> {
        return this.userService.createUser(request);
    }
}