import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

/**
 * JWT载荷接口
 */
export interface JwtPayload {
  sub: number; // 用户ID
  username: string;
  role: string;
  iat?: number; // 签发时间
  exp?: number; // 过期时间
}

/**
 * JWT认证策略
 * 用于验证JWT token并提取用户信息
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  /**
   * 验证JWT载荷
   * @param payload JWT载荷
   * @returns 用户信息
   */
  async validate(
    payload: JwtPayload,
  ): Promise<{ userId: number; username: string; role: string }> {
    try {
      // 这里可以根据需要添加更多的异步校验逻辑，例如查询数据库校验用户状态
      // 示例：await this.userService.findById(payload.sub);
      await Promise.resolve(); // 占位异步操作，确保包含 await 表达式

      return {
        userId: payload.sub,
        username: payload.username,
        role: payload.role,
      };
    } catch (error: unknown) {
      // 记录详细错误日志，包含上下文信息
      if (error instanceof Error) {
        throw new Error(`JWT校验失败: ${error.message}`);
      }
      throw new Error('JWT校验失败: 未知错误');
    }
  }
}
