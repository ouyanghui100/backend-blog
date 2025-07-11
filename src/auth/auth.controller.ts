import {
  Body,
  Controller,
  Get,
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
import { StatusCodes } from '../common/constants/status-codes';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { AuthService } from './auth.service';
import {
  AuthCheckResponseDto,
  AuthResponseDto,
  UserResponseDto,
} from './dto/auth-response.dto';
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
    status: StatusCodes.SUCCESS,
    description: '登录成功',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '登录成功' },
        data: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                username: { type: 'string', example: 'admin' },
                role: { type: 'string', example: 'admin' },
              },
            },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.BAD_REQUEST,
    description: '用户名或密码错误',
    schema: {
      example: {
        code: StatusCodes.BAD_REQUEST,
        message: '用户名或密码错误',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<ApiResponseDto<AuthResponseDto>> {
    try {
      const result = await this.authService.loginAdmin(
        loginDto.username,
        loginDto.password,
      );
      return ApiResponseDto.success(result, '登录成功');
    } catch (error: unknown) {
      if (error instanceof UnauthorizedException) {
        return ApiResponseDto.badRequest('用户名或密码错误');
      }
      return ApiResponseDto.internalError('登录失败');
    }
  }

  /**
   * 游客访问
   */
  @ApiOperation({
    summary: '游客访问',
    description: '生成游客访问令牌，游客只能执行查询操作',
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '游客访问令牌生成成功',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '游客访问令牌生成成功' },
        data: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 2 },
                username: { type: 'string', example: 'guest' },
                role: { type: 'string', example: 'guest' },
              },
            },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @Post('guest')
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
    status: StatusCodes.SUCCESS,
    description: '获取用户信息成功',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '获取用户信息成功' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            username: { type: 'string', example: 'admin' },
            role: { type: 'string', example: 'admin' },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.BAD_REQUEST,
    description: '用户信息不完整',
    schema: {
      example: {
        code: StatusCodes.BAD_REQUEST,
        message: '用户信息不完整',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.UNAUTHORIZED,
    description: 'Token失效或未提供',
    schema: {
      example: {
        code: StatusCodes.UNAUTHORIZED,
        message: '登录状态已失效，请重新登录',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req): ApiResponseDto<UserResponseDto> {
    const { userId, username, role } = req.user;
    if (!userId || !username || !role) {
      return ApiResponseDto.badRequest('用户信息不完整');
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
    status: StatusCodes.SUCCESS,
    description: '令牌有效',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '令牌有效' },
        data: {
          type: 'object',
          properties: {
            valid: { type: 'boolean', example: true },
            role: { type: 'string', example: 'admin' },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.UNAUTHORIZED,
    description: '令牌失效或未提供',
    schema: {
      example: {
        code: StatusCodes.UNAUTHORIZED,
        message: '登录状态已失效，请重新登录',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('check')
  checkAuth(@Request() req): ApiResponseDto<AuthCheckResponseDto> {
    return ApiResponseDto.success(
      {
        valid: true,
        role: req.user.role,
      },
      '令牌有效',
    );
  }
}
