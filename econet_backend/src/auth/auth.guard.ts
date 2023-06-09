// custom-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
/**
 * Middleware used to handle authorization on requests in function of the role
 * of the client
 */
@Injectable()
export class CustomAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return false;
        }

        return this.matchRoles(roles, user.role);
    }

    matchRoles(allowedRoles: string[], userRole: string): boolean {
        return allowedRoles.includes(userRole);
    }
}
