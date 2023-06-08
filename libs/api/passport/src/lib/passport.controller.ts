import { Controller, UseGuards, Req, Get, Request, Res } from '@nestjs/common';
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

    @Get('google/callback')
    @UseGuards(GoogleOAuthGuard)
    async googleAuthRedirect(@Req() req: Request, @Res() res: express_response) {
        this.passportService.generateJWT(req).then((token) => {
            res.cookie('jwt', token, { httpOnly: true });
            res.redirect(process.env['FRONTEND_URL'] || "");
        });
        const newUser:IUser = await this.passportService.getUser(req);
        console.log(newUser);
        try{
            this.userService.createUser({user: newUser});
        } catch (error) {
            if (error instanceof Error) 
                console.log("ERROR: "+error.message);
        }
    }
}
