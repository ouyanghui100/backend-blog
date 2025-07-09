import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 公开访问装饰器
 * 用于标记不需要JWT认证的接口（前台接口）
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
