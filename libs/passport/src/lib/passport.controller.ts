import { Controller, UseGuards, Req, Get, Request } from '@nestjs/common';
import { PassportService } from './passport.service';
import { GoogleOAuthGuard } from '../google-oauth-guard.guard';

@Controller('auth/')
export class PassportController {
  constructor(private passportService: PassportService) {}

  @Get('google/')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req: any) {
    /**/
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: any) {
    return this.passportService.googleLogin(req);
  }
}
