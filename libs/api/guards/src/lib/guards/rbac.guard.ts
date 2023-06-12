import {
  IGetUserRoleRequest,
  Role,
} from '@event-participation-trends/api/user/util';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '@event-participation-trends/api/user/feature';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private userService: UserService, private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request?.user?.email;
    if (email === undefined) {
      throw new UnauthorizedException();
    }
    const role_req: IGetUserRoleRequest = {
      userEmail: email,
    };
    let role: string;
    return this.userService.getUserRole(role_req).then((res) => {
      role = res.userRole || "";
      if(role === undefined || role === null || role === ""){
        throw new UnauthorizedException();
      }
      const min_role = this.reflector.get<Role>('role', context.getHandler());
      switch(min_role){
        case Role.ADMIN:
          if(role === Role.ADMIN.toString()){
            return true;
          }
          break;
        case Role.MANAGER:
          if(role === Role.ADMIN.toString() || role === Role.MANAGER.toString()){
            return true;
          }
          break;
        case Role.VIEWER:
          if(role === Role.ADMIN.toString() || role === Role.MANAGER.toString() || role === Role.VIEWER.toString()){
            return true;
          }
          break;
        default:
          throw new UnauthorizedException();
      }
      return false;
    });
  }
}
