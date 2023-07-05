import { Controller, UseGuards, SetMetadata, Get, Param } from '@nestjs/common';
import {
  JwtGuard,
  RbacGuard,
  CsrfGuard,
} from '@event-participation-trends/api/guards';
import { Role } from '@event-participation-trends/api/user/util';

@Controller('sensor')
export class SensorController {
  @SetMetadata('role', Role.MANAGER)
  @UseGuards(JwtGuard, RbacGuard, CsrfGuard)
  @Get(':id')
  findOne(@Param() params: any): string {
    console.log(params.id);
    // Process this id further...
    return params.id;
  }
}
