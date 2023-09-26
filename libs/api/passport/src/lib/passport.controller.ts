import { Controller, UseGuards, Req, Get, Request, Res, Post, Body } from '@nestjs/common';
import { Response as express_response } from 'express';
import { PassportService } from './passport.service';
import { GoogleOAuthGuard } from '../google-oauth-guard.guard';
import { UserService } from '@event-participation-trends/api/user/feature';
import { IUser } from '@event-participation-trends/api/user/util';

@Controller('auth/')
export class PassportController {
    constructor(
        private passportService: PassportService,
        private readonly userService: UserService,
    ) { }

    @Get('google/')
    @UseGuards(GoogleOAuthGuard)
    async googleAuth(@Request() req: any) {
        /**/
    }

    @Post('google/')
    @UseGuards(GoogleOAuthGuard)
    async googleAuthPOST(@Request() req: any, @Body() body: any) {
        /**/
    }

    @Get('google/callback')
    @UseGuards(GoogleOAuthGuard)
    async googleAuthRedirect(@Req() req: Request, @Res() res: express_response) {
        console.log(req);
        this.passportService.generateJWT(req).then((token: any) => {
            res.cookie('jwt', token.jwt, { httpOnly: true });
            res.cookie('csrf', token.hash);
            res.redirect(process.env['FRONTEND_URL'] || "");
        });
        const newUser:IUser = await this.passportService.getUser(req);
        try{
            this.userService.createUser({user: newUser});
        } catch (error) {
            if (error instanceof Error) 
                console.log("ERROR: "+error.message);
        }
    }

    @Post('google/callback')
    @UseGuards(GoogleOAuthGuard)
    async googleAuthRedirectPost(@Body() req: Request, @Res() res: express_response) {
        console.log(req);
        this.passportService.generateJWT(req).then((token: any) => {
            res.cookie('jwt', token.jwt, { httpOnly: true });
            res.cookie('csrf', token.hash);
            res.redirect(process.env['FRONTEND_URL'] || "");
        });
        const newUser:IUser = await this.passportService.getUser(req);
        try{
            this.userService.createUser({user: newUser});
        } catch (error) {
            if (error instanceof Error) 
                console.log("ERROR: "+error.message);
        }
    }
}
