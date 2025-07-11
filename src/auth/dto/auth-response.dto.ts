import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../entities/user.entity';

/**
 * 用户信息响应 DTO
 */
export class UserResponseDto {
  @ApiProperty({
    description: '用户ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '用户名',
    example: 'admin',
  })
  username: string;

  @ApiProperty({
    description: '用户角色',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role: UserRole;
}

/**
 * 登录响应 DTO
 */
export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT访问令牌',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: '用户信息',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}

/**
 * 认证状态检查响应 DTO
 */
export class AuthCheckResponseDto {
  @ApiProperty({
    description: '令牌是否有效',
    example: true,
  })
  valid: boolean;

  @ApiProperty({
    description: '用户角色',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role: UserRole;
}
