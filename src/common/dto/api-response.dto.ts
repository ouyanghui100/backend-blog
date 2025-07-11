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
    this.httpStatus = options.httpStatus ?? options.code; // 默认HTTP状态码等于业务状态码
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
    });
  }

  /**
   * 创建资源成功响应 (HTTP 201)
   */
  static created<T>(data: T, message = '创建成功'): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.CREATED,
      message,
      data,
    });
  }

  /**
   * 创建请求错误响应 (HTTP 400)
   */
  static badRequest<T = null>(
    message = '请求参数错误',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.BAD_REQUEST,
      message,
      data,
    });
  }

  /**
   * 创建未授权响应 (HTTP 401)
   */
  static unauthorized<T = null>(
    message = '登录状态已失效，请重新登录',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.UNAUTHORIZED,
      message,
      data,
    });
  }

  /**
   * 创建禁止访问响应 (HTTP 403)
   */
  static forbidden<T = null>(
    message = '操作被禁止',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.FORBIDDEN,
      message,
      data,
    });
  }

  /**
   * 创建资源不存在响应 (HTTP 404)
   */
  static notFound<T = null>(
    message = '资源不存在',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.NOT_FOUND,
      message,
      data,
    });
  }

  /**
   * 创建资源冲突响应 (HTTP 409)
   */
  static conflict<T = null>(
    message = '资源已存在',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.CONFLICT,
      message,
      data,
    });
  }

  /**
   * 创建请求实体错误响应 (HTTP 422)
   */
  static unprocessableEntity<T = null>(
    message = '请求格式正确但语义错误',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.UNPROCESSABLE_ENTITY,
      message,
      data,
    });
  }

  /**
   * 创建服务器内部错误响应 (HTTP 500)
   */
  static internalError<T = null>(
    message = '服务器内部错误',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.INTERNAL_ERROR,
      message,
      data,
    });
  }

  /**
   * 创建服务不可用响应 (HTTP 503)
   */
  static serviceUnavailable<T = null>(
    message = '服务暂时不可用，请稍后重试',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto({
      code: StatusCodes.SERVICE_UNAVAILABLE,
      message,
      data,
    });
  }

  // =================== 兼容旧方法名 ===================

  /**
   * @deprecated 使用 badRequest 替代
   */
  static validationFailed<T = null>(
    message = '数据验证失败',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return ApiResponseDto.badRequest(message, data);
  }

  /**
   * @deprecated 使用 notFound 替代
   */
  static resourceNotFound<T = null>(
    message = '资源不存在',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return ApiResponseDto.notFound(message, data);
  }

  /**
   * @deprecated 使用 conflict 替代
   */
  static resourceExists<T = null>(
    message = '资源已存在',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return ApiResponseDto.conflict(message, data);
  }

  /**
   * @deprecated 使用 forbidden 替代
   */
  static operationForbidden<T = null>(
    message = '操作被禁止',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return ApiResponseDto.forbidden(message, data);
  }

  /**
   * @deprecated 使用 unauthorized 替代
   */
  static loginExpired<T = null>(
    message = '登录状态已失效，请重新登录',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return ApiResponseDto.unauthorized(message, data);
  }

  /**
   * @deprecated 使用 serviceUnavailable 替代
   */
  static serviceBusy<T = null>(
    message = '业务繁忙，请稍后重试',
    data: T = null as T,
  ): ApiResponseDto<T> {
    return ApiResponseDto.serviceUnavailable(message, data);
  }
}
