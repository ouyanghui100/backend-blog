import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../entities/category.entity';
import { CategorySeedService } from './category-seed.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

/**
 * 分类模块
 * 管理分类相关的功能
 */
@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategorySeedService],
  exports: [CategoryService, CategorySeedService],
})
export class CategoryModule {}
