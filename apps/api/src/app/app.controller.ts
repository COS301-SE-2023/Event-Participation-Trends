import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(JwtGuard)
  getData() {
    return this.appService.getData();
  }
}
