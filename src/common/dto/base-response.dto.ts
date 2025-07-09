import { DateUtil } from '../utils/date.util';

/**
 * 基础时间字段接口
 */
export interface BaseTimeFields {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 基础响应 DTO
 * 提供通用的时间格式化功能
 */
export abstract class BaseResponseDto {
  createdAt: string;
  updatedAt: string;

  /**
   * 格式化基础时间字段
   * @param entity - 包含时间字段的实体对象
   */
  protected formatBaseTimeFields(entity: BaseTimeFields): void {
    this.createdAt = DateUtil.formatDateTime(entity.createdAt) || '';
    this.updatedAt = DateUtil.formatDateTime(entity.updatedAt) || '';
  }
}

/**
 * API 统一响应格式
 */
export class ApiResponseDto<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;

  constructor(success: boolean, message: string, data?: T, error?: string) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  static success<T>(data: T, message: string = '操作成功'): ApiResponseDto<T> {
    return new ApiResponseDto(true, message, data);
  }

  static error<T>(message: string, error?: string): ApiResponseDto<T | null> {
    return new ApiResponseDto<T | null>(false, message, null, error);
  }
}
