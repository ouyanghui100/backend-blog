/**
 * JWT认证常量配置
 */
export const jwtConstants = {
  // JWT密钥（生产环境应该从环境变量读取）
  secret:
    process.env.JWT_SECRET ||
    'your-super-secret-jwt-key-change-it-in-production',
  // Token过期时间
  expiresIn: '168h',
};
