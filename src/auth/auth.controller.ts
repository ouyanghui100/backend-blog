import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * 认证控制器
 * 提供登录、游客访问等认证相关接口
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 管理员登录
   */
  @ApiOperation({
    summary: '管理员登录',
    description: '管理员通过用户名和密码登录，获取访问令牌',
  })
  @ApiBody({
    type: LoginDto,
    description: '登录信息',
    examples: {
      admin: {
        summary: '管理员登录',
        value: {
          username: 'admin',
          password: 'admin123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      example: {
        code: 200,
        message: '登录成功',
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 1,
            username: 'admin',
            role: 'admin',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '用户名或密码错误',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<ApiResponseDto<AuthResponseDto>> {
    const result = await this.authService.loginAdmin(
      loginDto.username,
      loginDto.password,
    );
    return ApiResponseDto.success(result, '登录成功');
  }

  /**
   * 游客访问
   */
  @ApiOperation({
    summary: '游客访问',
    description: '生成游客访问令牌，游客只能执行查询操作',
  })
  @ApiResponse({
    status: 200,
    description: '游客访问令牌生成成功',
    schema: {
      example: {
        code: 200,
        message: '游客访问令牌生成成功',
        data: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          user: {
            id: 2,
            username: 'guest',
            role: 'guest',
          },
        },
      },
    },
  })
  @Post('guest')
  @HttpCode(HttpStatus.OK)
  async guestAccess(): Promise<ApiResponseDto<AuthResponseDto>> {
    const result = await this.authService.guestAccess();
    return ApiResponseDto.success(result, '游客访问令牌生成成功');
  }

  /**
   * 获取当前用户信息
   */
  @ApiOperation({
    summary: '获取当前用户信息',
    description: '获取当前登录用户的基本信息',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '获取用户信息成功',
    schema: {
      example: {
        code: 200,
        message: '获取用户信息成功',
        data: {
          id: 1,
          username: 'admin',
          role: 'admin',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权访问',
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(
    @Request() req,
  ): ApiResponseDto<{ id: number; username: string; role: string }> {
    const { userId, username, role } = req.user;
    if (!userId || !username || !role) {
      throw new UnauthorizedException('用户信息不完整');
    }
    return ApiResponseDto.success(
      {
        id: userId,
        username,
        role,
      },
      '获取用户信息成功',
    );
  }

  /**
   * 检查认证状态
   */
  @ApiOperation({
    summary: '检查认证状态',
    description: '验证当前令牌是否有效',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '令牌有效',
    schema: {
      example: {
        code: 200,
        message: '令牌有效',
        data: {
          valid: true,
          role: 'admin',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '令牌无效或已过期',
  })
  @UseGuards(JwtAuthGuard)
  @Get('check')
  checkAuth(@Request() req): ApiResponseDto<{ valid: boolean; role: string }> {
    return ApiResponseDto.success(
      {
        valid: true,
        role: req.user.role,
      },
      '令牌有效',
    );
  }
}
