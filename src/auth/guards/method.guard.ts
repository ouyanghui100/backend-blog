import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from '../../entities/user.entity';

/**
 * HTTP方法权限守卫
 * 用于限制游客只能使用GET请求
 */
@Injectable()
export class MethodGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user, method } = request;

    // 如果没有用户信息，拒绝访问
    if (!user) {
      throw new ForbiddenException('未授权访问');
    }

    // 管理员可以使用所有HTTP方法
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // 游客只能使用GET请求
    if (user.role === UserRole.GUEST && method === 'GET') {
      return true;
    }

    // 其他情况拒绝访问
    throw new ForbiddenException('游客只能执行查询操作');
  }
}
