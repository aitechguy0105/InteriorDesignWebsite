import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from './user.roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      // No roles defined, allow access
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      // User or user role not found, deny access
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}
