import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtGuard } from '../guards/jwt.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  getData() {
    return this.appService.getData();
  }
}
