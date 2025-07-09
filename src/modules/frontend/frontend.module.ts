import { Module } from '@nestjs/common';
import { CategoryModule } from '../category/category.module';
import { TagModule } from '../tag/tag.module';
import { FrontendController } from './frontend.controller';

/**
 * 前台模块
 * 提供前台页面需要的公开API接口（无需认证）
 */
@Module({
  imports: [TagModule, CategoryModule],
  controllers: [FrontendController],
})
export class FrontendModule {}
