import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt: any = request.user;
    const csrf = request.headers['x-csrf-token'];
    if (csrf === undefined || jwt === undefined || (csrf !== jwt.hash)) {
      return false;
    }
    return true;
  }
}
