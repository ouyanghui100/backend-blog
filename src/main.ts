import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
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
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 应用成功启动，监听端口: ${port}`);
  logger.log(`📚 API文档地址: http://localhost:${port}/api`);
  logger.log(`🌐 CORS已启用，支持跨域请求`);
}

// 启动应用并处理错误
void bootstrap().catch(error => {
  const logger = new Logger('Bootstrap');
  logger.error('❌ 应用启动失败:', error);
  process.exit(1);
});
