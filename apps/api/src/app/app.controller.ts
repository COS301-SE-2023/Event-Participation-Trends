import { Controller, Get, UseGuards, SetMetadata, Req } from '@nestjs/common';
import { JwtGuard, RbacGuard } from '@event-participation-trends/api/guards';
import { AppService } from './app.service';
import { UserService } from '@event-participation-trends/api/user/feature';
import { Role } from '@event-participation-trends/api/user/util';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  @SetMetadata('role', Role.VIEWER)
  @UseGuards(JwtGuard, RbacGuard)
  getData(@Req() req: any) {
    return this.appService.getData();
  }
}
