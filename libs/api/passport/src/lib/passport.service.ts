import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '@event-participation-trends/api/user/util';
import { randomBytes } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class PassportService {
  constructor(private readonly jwtService: JwtService) {}
  async generateJWT(toSign: any) {
    const user = toSign.user;
    if (user === undefined) return '';
    const randomBytesP = promisify(randomBytes);
    const willSign = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
      hash: (await randomBytesP(16)).toString('hex'),
    };
    return await {
      jwt: await this.jwtService.signAsync(willSign, {
        privateKey: process.env['JWT_SECRET'],
        expiresIn: process.env['JWT_EXPIRE_TIME'],
      }),
      hash: willSign.hash,
    };
  }

  async getUser(toSign: any): Promise<IUser> {
    const user = toSign.user;
    const willSign: IUser = {
      Email: user.email,
      FirstName: user.firstName,
      LastName: user.lastName,
      photo: user.picture,
    };
    return Promise.resolve(willSign);
  }
}
