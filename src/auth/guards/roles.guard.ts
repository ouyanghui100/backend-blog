import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * 角色权限守卫
 * 用于检查用户是否具有访问特定接口的角色权限
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 如果没有设置角色要求，则允许访问
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // 检查用户是否具有所需角色
    return requiredRoles.some(role => user.role === role);
  }
}
