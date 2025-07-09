import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AuthInitService } from './auth-init.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MethodGuard } from './guards/method.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

/**
 * 认证模块
 * 提供JWT认证、权限控制等功能
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthInitService, // 添加初始化服务
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    MethodGuard,
  ],
  exports: [AuthService, JwtAuthGuard, RolesGuard, MethodGuard],
})
export class AuthModule {}
