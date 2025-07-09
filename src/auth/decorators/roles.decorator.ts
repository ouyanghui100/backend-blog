import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../entities/user.entity';

export const ROLES_KEY = 'roles';

/**
 * 角色装饰器
 * 用于标记需要特定角色才能访问的接口
 * @param roles 允许访问的角色数组
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
