import { ApiProperty } from '@nestjs/swagger';

/**
 * API 统一响应格式 DTO
 */
export class ApiResponseDto<T = unknown> {
  @ApiProperty({
    description: '请求是否成功',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '响应消息',
    example: '操作成功',
  })
  message: string;

  @ApiProperty({
    description: '响应数据',
    example: null,
  })
  data: T;

  @ApiProperty({
    description: '时间戳',
    example: '2024-01-15 18:30:45',
  })
  timestamp: string;

  constructor(success: boolean, message: string, data: T) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date()
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);
  }

  /**
   * 创建成功响应
   */
  static success<T>(data: T, message = '操作成功'): ApiResponseDto<T> {
    return new ApiResponseDto(true, message, data);
  }

  /**
   * 创建失败响应
   */
  static error<T = null>(
    message = '操作失败',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto(false, message, data);
  }
}
