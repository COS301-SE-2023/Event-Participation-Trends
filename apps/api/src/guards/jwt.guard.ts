import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import * as cookieParser from 'cookie-parser';


@Injectable()
export class JwtGuard implements CanActivate {
  constructor (jwtService: JwtService) { /**/}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwtCookie = request.cookies['jwt'];
    console.log(request);
    console.log(jwtCookie);
    return true;
  }
}
