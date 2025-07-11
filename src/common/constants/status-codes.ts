/**
 * 状态码常量
 * 业务状态码直接对应 HTTP 状态码，更加直观和标准
 */
export const StatusCodes = {
  // =================== 成功状态码 (2xx) ===================
  SUCCESS: 200, // 操作成功

  // =================== 客户端错误 (4xx) ===================
  BAD_REQUEST: 400, // 请求参数错误/数据验证失败
  UNAUTHORIZED: 401, // 未授权/登录失效
  FORBIDDEN: 403, // 禁止访问/操作被禁止
  NOT_FOUND: 404, // 资源不存在
  CONFLICT: 409, // 资源冲突/已存在
  UNPROCESSABLE_ENTITY: 422, // 请求格式正确但语义错误

  // =================== 服务器错误 (5xx) ===================
  INTERNAL_ERROR: 500, // 服务器内部错误
  SERVICE_UNAVAILABLE: 503, // 服务不可用/业务繁忙
} as const;

export type StatusCode = (typeof StatusCodes)[keyof typeof StatusCodes];
