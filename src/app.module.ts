import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import { entities } from './entities';
import { CategoryModule } from './modules/category/category.module';
import { FrontendModule } from './modules/frontend/frontend.module';
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    // 数据库模块
    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (dbConfig: ReturnType<typeof databaseConfig>) => ({
        ...dbConfig,
        entities,
      }),
    }),
    TagModule,
    CategoryModule,
    FrontendModule, // 前台模块（公开接口）
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
