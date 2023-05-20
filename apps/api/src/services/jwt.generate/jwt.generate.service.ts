import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGenerateService {
    constructor(
        private jwtService: JwtService,
    ) {}

    async generateJwt(payload: object) {
        const access_token_g = await this.jwtService.signAsync(payload);
        return access_token_g;
    }
}
