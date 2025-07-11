import { ApiProperty } from '@nestjs/swagger';
import { StatusCode, StatusCodes } from '../constants/status-codes';

/**
 * API响应构造参数接口
 */
interface ApiResponseOptions<T> {
  code: StatusCode;
  message: string;
  data: T;
  httpStatus?: number;
}

/**
 * API 统一响应格式 DTO
 */
export class ApiResponseDto<T = unknown> {
  @ApiProperty({
    description: '状态码',
    example: 200,
  })
  code: StatusCode;

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

  // HTTP状态码，用于控制器设置HTTP响应状态
  httpStatus?: number;

  constructor(options: ApiResponseOptions<T>) {
    this.code = options.code;
    this.message = options.message;
    this.data = options.data;
    this.httpStatus = options.httpStatus;
    this.timestamp = new Date()
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);
  }

  /**
   * 创建成功响应 (HTTP 200)
   */
  static success<T>(data: T, message = '操作成功'): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.SUCCESS,
      message,
      data,
      httpStatus: 200,
    });
  }

  /**
   * 创建失败响应（通用，HTTP 200）
   */
  static error<T = null>(
    message = '操作失败',
    code: StatusCode = StatusCodes.INTERNAL_ERROR,
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code,
      message,
      data,
      httpStatus: 200,
    });
  }

  // =================== 业务层错误 (HTTP 200，业务code 300-400) ===================

  /**
   * 创建通用业务错误响应 (HTTP 200, code 300)
   */
  static businessError<T = null>(
    message = '业务处理失败',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.BUSINESS_ERROR,
      message,
      data,
      httpStatus: 200,
    });
  }

  /**
   * 创建数据验证失败响应 (HTTP 200, code 301)
   */
  static validationFailed<T = null>(
    message = '数据验证失败',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.VALIDATION_FAILED,
      message,
      data,
      httpStatus: 200,
    });
  }

  /**
   * 创建资源不存在响应 (HTTP 200, code 302)
   */
  static resourceNotFound<T = null>(
    message = '资源不存在',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.RESOURCE_NOT_FOUND,
      message,
      data,
      httpStatus: 200,
    });
  }

  /**
   * 创建资源已存在响应 (HTTP 200, code 303)
   */
  static resourceExists<T = null>(
    message = '资源已存在',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.RESOURCE_ALREADY_EXISTS,
      message,
      data,
      httpStatus: 200,
    });
  }

  /**
   * 创建操作被禁止响应 (HTTP 200, code 304)
   */
  static operationForbidden<T = null>(
    message = '操作被禁止',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.OPERATION_FORBIDDEN,
      message,
      data,
      httpStatus: 200,
    });
  }

  /**
   * 创建参数无效响应 (HTTP 200, code 305)
   */
  static parameterInvalid<T = null>(
    message = '参数无效',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.PARAMETER_INVALID,
      message,
      data,
      httpStatus: 200,
    });
  }

  // =================== HTTP层面错误 (HTTP状态码与code一致) ===================

  /**
   * 创建登录状态失效响应 (HTTP 401, code 401)
   */
  static loginExpired<T = null>(
    message = '登录状态已失效，请重新登录',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.LOGIN_EXPIRED,
      message,
      data,
      httpStatus: 401,
    });
  }

  /**
   * 创建请求超时响应 (HTTP 408, code 408)
   */
  static requestTimeout<T = null>(
    message = '请求超时',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.REQUEST_TIMEOUT,
      message,
      data,
      httpStatus: 408,
    });
  }

  /**
   * 创建服务器内部错误响应 (HTTP 500, code 500)
   */
  static internalError<T = null>(
    message = '服务器内部错误',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.INTERNAL_ERROR,
      message,
      data,
      httpStatus: 500,
    });
  }

  /**
   * 创建业务繁忙响应 (HTTP 503, code 503)
   */
  static serviceBusy<T = null>(
    message = '业务繁忙，请稍后重试',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.SERVICE_BUSY,
      message,
      data,
      httpStatus: 503,
    });
  }
}
