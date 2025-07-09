import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

/**
 * 管理员登录 DTO
 */
export class LoginDto {
  @ApiProperty({
    description: '用户名',
    example: 'admin',
    minLength: 3,
    maxLength: 50,
  })
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(3, { message: '用户名长度不能少于3个字符' })
  @MaxLength(50, { message: '用户名长度不能超过50个字符' })
  username: string;

  @ApiProperty({
    description: '密码',
    example: 'admin123',
    minLength: 6,
    maxLength: 50,
  })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码长度不能少于6个字符' })
  @MaxLength(50, { message: '密码长度不能超过50个字符' })
  password: string;
}
