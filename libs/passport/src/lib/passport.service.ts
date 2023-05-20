import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PassportService {
    constructor(private readonly jwtService: JwtService) {}
    async generateJWT(toSign: any){
        console.log(toSign.user);
        return await this.jwtService.signAsync(toSign.user);
    }
}
