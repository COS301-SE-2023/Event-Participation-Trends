import {
  Controller,
  UseGuards,
  SetMetadata,
  Get,
  Param,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import {
  RbacGuard,
  CsrfGuard,
  JwtGuard,
} from '@event-participation-trends/api/guards';
import { Role } from '@event-participation-trends/api/user/util';
import { SensorlinkingService } from './sensorlinking.service';
import { IgetNewEventSensorIdResponse, IisLinkedResponse } from '../interfaces';
import { IlinkSensorRequest } from '../interfaces/linkSensorRequest.interface';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Controller('sensorlinking')
export class SensorlinkingController {
  constructor(private readonly sensorLinkingService: SensorlinkingService) {}

  @SetMetadata('role', Role.MANAGER)
  @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
  @Get('getNewID')
  async getNewID(): Promise<IgetNewEventSensorIdResponse> {
    return await this.sensorLinkingService.getNewEventSensorId().then((res) => {
      return {
        id: res,
      };
    });
  }

  @SetMetadata('role', Role.MANAGER)
  @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
  @Get('isLinked/:id')
  async isLinked(@Param('id') id: string): Promise<IisLinkedResponse> {
    return await this.sensorLinkingService.isLinked(id).then((res) => {
      return {
        isLinked: res,
      };
    });
  }

  @SetMetadata('role', Role.MANAGER)
  @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
  @Post(':mac')
  async linkDevice(@Body() request: IlinkSensorRequest, @Param('mac') mac: string) {
    try {
      if(mac === undefined){
        return new BadRequestException('Mac address is undefined');
      }
      if(request.id === undefined){
        return new BadRequestException('Event sensor id is undefined');
      }
      await this.sensorLinkingService.linkSensorToEventSensor(mac, request.id);
    } catch (e) {
      return new BadRequestException(`Oops, something went wrong while trying to link mac ${mac} to event sensor ${request.id}`);
    }
    return {
      success: true,
    };
  }
}
