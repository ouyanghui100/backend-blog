import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}

// 启动应用并处理错误
void bootstrap().catch(error => {
  // eslint-disable-next-line no-console
  console.error('应用启动失败:', error);
  process.exit(1);
});
