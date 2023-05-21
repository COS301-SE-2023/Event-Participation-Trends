import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = request.cookies['jwt'];
    if (!jwt) {
      throw new UnauthorizedException();
    }
    try{
      const data = await this.jwtService.verifyAsync(jwt);
      request.user = data;
    }
    catch(e){
      throw new UnauthorizedException();
    }
    return true;
  }
}
