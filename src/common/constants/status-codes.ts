/**
 * 状态码常量
 */
export const StatusCodes = {
  // 成功状态码
  SUCCESS: 200,

  // 业务层错误码 (300-400)
  BUSINESS_ERROR: 300, // 通用业务错误
  VALIDATION_FAILED: 301, // 数据验证失败
  RESOURCE_NOT_FOUND: 302, // 资源不存在
  RESOURCE_ALREADY_EXISTS: 303, // 资源已存在
  OPERATION_FORBIDDEN: 304, // 操作被禁止
  PARAMETER_INVALID: 305, // 参数无效

  // 特殊业务错误码（需要特殊处理）
  LOGIN_EXPIRED: 401, // Token失效（前端会执行logout）

  // HTTP层面错误码（真正的网络错误）
  REQUEST_TIMEOUT: 408, // 请求超时
  INTERNAL_ERROR: 500, // 服务器内部错误（未知错误）
  SERVICE_BUSY: 503, // 业务繁忙/服务不可用
} as const;

export type StatusCode = (typeof StatusCodes)[keyof typeof StatusCodes];
