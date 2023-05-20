import { Controller, UseGuards, Req, Get, Request, Res } from '@nestjs/common';
import { Response as express_response } from 'express';
import { PassportService } from './passport.service';
import { GoogleOAuthGuard } from '../google-oauth-guard.guard'

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
  async googleAuthRedirect(@Req() req: Request, @Res() res: express_response) {
    this.passportService.generateJWT(req).then((token) => {
      res.cookie('jwt', token, { httpOnly: true });
      res.redirect('/api');
    });
  }
}
