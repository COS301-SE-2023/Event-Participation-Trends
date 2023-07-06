import { GlobalService } from '@event-participation-trends/api/global/feature';
import {
    ICreateGlobalRequest,
    ICreateGlobalResponse,
} from '@event-participation-trends/api/global/util';
import {
    Body,
    Controller,
    Post,
    Get,
    UseGuards,
    Req,
    Query,
    SetMetadata,
    HttpException,
  } from '@nestjs/common';
import { Request } from 'express';
import {
    CsrfGuard,
    JwtGuard,
    RbacGuard,
  } from '@event-participation-trends/api/guards';
import { Role } from '@event-participation-trends/api/user/util';

@Controller('global')
export class GlobalController {
  constructor(private globalService: GlobalService) {}

    @Post('createGlobal')
    @SetMetadata('role', Role.MANAGER)
    @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
    async createEvent(
        @Body() requestBody: ICreateGlobalRequest
    ): Promise<ICreateGlobalResponse> {

        const extractRequest: ICreateGlobalRequest = {
            sensorIdToMacs: requestBody.sensorIdToMacs
        };

        return this.globalService.createGlobal(extractRequest);
    }
}