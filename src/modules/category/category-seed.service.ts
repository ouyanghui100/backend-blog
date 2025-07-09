import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto';

/**
 * 分类种子数据服务
 * 负责初始化系统默认分类
 */
@Injectable()
export class CategorySeedService implements OnModuleInit {
  private readonly logger = new Logger(CategorySeedService.name);

  constructor(private readonly categoryService: CategoryService) {}

  /**
   * 模块初始化时自动检查并初始化分类数据
   */
  async onModuleInit(): Promise<void> {
    try {
      await this.autoInitializeCategories();
    } catch (error) {
      this.logger.error('自动初始化分类数据失败', error);
    }
  }

  /**
   * 自动初始化分类数据（仅在数据库为空时）
   */
  private async autoInitializeCategories(): Promise<void> {
    this.logger.log('检查分类数据...');

    // 检查数据库中是否已存在分类
    const existingCategories = await this.categoryService.findAll({});

    if (existingCategories.length > 0) {
      this.logger.log(
        `数据库中已存在 ${existingCategories.length} 个分类，跳过初始化`,
      );
      return;
    }

    this.logger.log('数据库中无分类数据，开始自动初始化...');
    await this.seedCategories();
  }

  /**
   * 初始化默认分类
   */
  async seedCategories(): Promise<void> {
    this.logger.log('开始初始化分类数据...');

    // 默认分类数据
    const defaultCategories: CreateCategoryDto[] = [
      {
        name: '前端开发',
      },
      {
        name: '后端开发',
      },
      {
        name: '移动开发',
      },
      {
        name: '数据库',
      },
      {
        name: '算法与数据结构',
      },
      {
        name: '系统设计',
      },
      {
        name: '工具与效率',
      },
      {
        name: '职业发展',
      },
      {
        name: '技术随笔',
      },
      {
        name: '项目实战',
      },
    ];

    try {
      // 检查并创建分类
      for (const categoryData of defaultCategories) {
        const existingCategory = await this.categoryService.findByName(
          categoryData.name,
        );
        if (!existingCategory) {
          await this.categoryService.create(categoryData);
          this.logger.log(`创建分类: ${categoryData.name}`);
        } else {
          this.logger.log(`分类已存在: ${categoryData.name}`);
        }
      }

      this.logger.log('分类数据初始化完成');
    } catch (error) {
      this.logger.error('分类数据初始化失败', error);
      throw error;
    }
  }

  /**
   * 重置分类数据（开发环境使用）
   */
  async resetCategories(): Promise<void> {
    this.logger.warn('重置分类数据...');

    try {
      // 获取所有分类
      const allCategories = await this.categoryService.findAll({});

      // 删除所有分类（仅当没有关联文章时）
      for (const category of allCategories) {
        try {
          await this.categoryService.remove(category.id);
          this.logger.log(`删除分类: ${category.name}`);
        } catch (error) {
          this.logger.warn(`跳过分类 "${category.name}": ${error.message}`);
        }
      }

      // 重新创建默认分类
      await this.seedCategories();

      this.logger.log('分类数据重置完成');
    } catch (error) {
      this.logger.error('分类数据重置失败', error);
      throw error;
    }
  }
}
