import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);

  // 启用CORS跨域支持
  app.enableCors({
    origin: true, // 允许所有域名访问，开发和生产环境均可跨域
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // 启用全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 自动转换类型
      whitelist: true, // 自动移除未在DTO中定义的属性
      forbidNonWhitelisted: true, // 如果存在未定义的属性则抛出错误
      disableErrorMessages: false, // 生产环境可设为true
    }),
  );

  // 设置全局路径前缀
  app.setGlobalPrefix('api/v1');

  // 获取端口号
  const port = process.env.PORT ?? 3000;

  // 配置 Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('React-Nest 博客后端 API')
    .setDescription(
      `
      ## 博客系统后端API文档

      这是一个基于 NestJS + TypeScript + MySQL 构建的博客后端系统。

      ### 主要功能模块
      - **认证授权**：JWT认证、管理员登录、游客访问
      - **标签管理**：文章标签的增删改查
      - **分类管理**：文章分类的增删改查
      - **前台接口**：前台页面的公开API（无需认证）
      - **用户管理**：用户注册、登录、权限管理
      - **文章管理**：文章的发布、编辑、删除
      - **评论管理**：评论的发布、审核、回复

      ### 认证说明
      - **后台接口**：需要JWT Token认证
        - 管理员：可以执行所有操作
        - 游客：只能执行GET查询操作
      - **前台接口**：无需认证，公开访问

      ### 技术栈
      - **后端框架**：NestJS
      - **数据库**：MySQL + TypeORM
      - **语言**：TypeScript
      - **认证**：JWT + Passport
      - **文档**：Swagger/OpenAPI 3.0

      ### 通用说明
      - 所有时间字段统一返回 \`YYYY-MM-DD HH:mm:ss\` 格式
      - API 响应统一使用 \`ApiResponseDto\` 格式
      - 支持 CORS 跨域请求

      ### Swagger JSON 导入地址
      \`\`\`
      http://localhost:${port}/api/docs-json
      \`\`\`
    `,
    )
    .setVersion('1.0.0')
    .addServer(`http://localhost:${port}`, '本地开发环境')
    .addServer('https://api.yourdomain.com', '生产环境')
    .addServer('https://staging-api.yourdomain.com', '测试环境')
    .addTag('auth', '认证授权 - 管理员登录、游客访问、JWT认证')
    .addTag('frontend', '前台接口 - 公开API（无需认证）')
    .addTag('tags', '标签管理 - 文章标签的增删改查（需要认证）')
    .addTag('categories', '分类管理 - 文章分类的增删改查（需要认证）')
    .addTag('users', '用户管理 - 用户信息管理')
    .addTag('articles', '文章管理 - 文章发布编辑')
    .addTag('comments', '评论管理 - 评论发布审核')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description:
        '输入JWT token（获取方式：POST /api/auth/login 或 POST /api/auth/guest）',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // 保持授权状态
      docExpansion: 'none', // 默认不展开文档
      filter: true, // 启用过滤功能
      showRequestDuration: true, // 显示请求耗时
    },
    customSiteTitle: 'React-Nest 博客 API 文档',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info .title { color: #3b82f6; }
    `,
  });

  await app.listen(port);

  logger.log(`🚀 应用成功启动，监听端口: ${port}`);
  logger.log(`📚 API文档地址: http://localhost:${port}/api/docs`);
  logger.log(`🌐 CORS已启用，支持跨域请求`);
}

// 启动应用并处理错误
void bootstrap().catch(error => {
  const logger = new Logger('Bootstrap');
  logger.error('❌ 应用启动失败:', error);
  process.exit(1);
});
