import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * 数据库配置
 * 使用环境变量进行配置管理
 */
export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(String(process.env.DB_PORT), 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'blog_mysql',
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    synchronize: process.env.NODE_ENV === 'development', // 仅在开发环境自动同步
    autoLoadEntities: true,
    logging: process.env.NODE_ENV === 'development',
    timezone: '+08:00', // 设置时区为中国时区
    charset: 'utf8mb4', // 支持完整的 UTF-8 字符集
    extra: {
      connectionLimit: 10, // 连接池大小
    },
  }),
);
