import { Controller, Get, UseGuards, RequestMapping, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtGuard } from '../guards/jwt.guard';
import { AppService } from './app.service';
import { JwtGenerateService } from '../services/jwt.generate/jwt.generate.service';
import cookieParser from 'cookie-parser';
import { randomInt, randomUUID } from 'crypto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly JwtGenerateService: JwtGenerateService
  ) {}

  @Get()
  @UseGuards(JwtGuard)
  getData() {
    return this.appService.getData();
  }

  @Get('/login')
  async login(@Res() response: Response) {
    const responseCookie = await this.JwtGenerateService.generateJwt({ id: randomUUID(), username: 'test' }).then((jwt) => {
      response.cookie('jwt', jwt, { httpOnly: true });
      response.redirect('/api/');
    });
  }
}
