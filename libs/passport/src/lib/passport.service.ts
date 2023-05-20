import { UntypedFormBuilder } from '@angular/forms';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PassportService {
    constructor(private readonly jwtService: JwtService) {}
    async generateJWT(toSign: any){
        const user = toSign.user;
        if(user === undefined)
            return "";
        const willSign = {
            email: user.email,
            firstName: user.firstName,
            lastnName: user.lastName,
            picture: user.picture,
        };
        return await this.jwtService.signAsync(willSign);
    }
}
