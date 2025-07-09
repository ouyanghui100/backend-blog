import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { DateUtil } from '../common/utils/date.util';
import { User, UserRole } from '../entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';

/**
 * 登录响应接口
 */
export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    username: string;
    role: UserRole;
  };
}

/**
 * 认证服务
 * 负责用户登录、token生成等认证相关操作
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 验证管理员用户名和密码
   */
  async validateAdmin(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        username,
        role: UserRole.ADMIN,
        isActive: true,
      },
    });

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      return user;
    }

    return null;
  }

  /**
   * 管理员登录
   */
  async loginAdmin(username: string, password: string): Promise<LoginResponse> {
    const user = await this.validateAdmin(username, password);

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 更新最后登录时间
    await this.userRepository.update(user.id, {
      lastLoginAt: DateUtil.now(),
    });

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  /**
   * 游客访问（生成游客token）
   */
  async guestAccess(): Promise<LoginResponse> {
    // 创建或获取游客用户
    let guestUser = await this.userRepository.findOne({
      where: {
        username: 'guest',
        role: UserRole.GUEST,
      },
    });

    if (!guestUser) {
      // 如果游客用户不存在，创建一个
      guestUser = this.userRepository.create({
        username: 'guest',
        role: UserRole.GUEST,
        isActive: true,
        createdAt: DateUtil.now(),
      });
      await this.userRepository.save(guestUser);
    }

    // 更新最后登录时间
    await this.userRepository.update(guestUser.id, {
      lastLoginAt: DateUtil.now(),
    });

    const payload: JwtPayload = {
      sub: guestUser.id,
      username: guestUser.username,
      role: guestUser.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: guestUser.id,
        username: guestUser.username,
        role: guestUser.role,
      },
    };
  }

  /**
   * 创建管理员用户（初始化用）
   */
  async createAdmin(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = this.userRepository.create({
      username,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: DateUtil.now(),
    });

    return await this.userRepository.save(admin);
  }

  /**
   * 检查是否已有管理员用户
   */
  async hasAdmin(): Promise<boolean> {
    const count = await this.userRepository.count({
      where: {
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
    return count > 0;
  }
}
