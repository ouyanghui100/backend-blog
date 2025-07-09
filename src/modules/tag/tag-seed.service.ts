import { Injectable, Logger } from '@nestjs/common';
import { CreateTagDto } from './dto';
import { TagService } from './tag.service';

/**
 * 标签种子数据服务
 * 负责初始化系统默认标签
 */
@Injectable()
export class TagSeedService {
  private readonly logger = new Logger(TagSeedService.name);

  constructor(private readonly tagService: TagService) {}

  /**
   * 初始化默认标签
   */
  async seedTags(): Promise<void> {
    this.logger.log('开始初始化标签数据...');

    // 默认标签数据
    const defaultTags: CreateTagDto[] = [
      {
        name: 'JSON',
      },
      {
        name: '动画',
      },
      {
        name: 'HTML',
      },
      {
        name: 'CSS',
      },
      {
        name: 'JavaScript',
      },
      {
        name: 'TypeScript',
      },
      {
        name: 'React',
      },
      {
        name: 'Vue',
      },
      {
        name: 'Node.js',
      },
      {
        name: 'NestJS',
      },
    ];

    try {
      // 检查并创建标签
      for (const tagData of defaultTags) {
        const existingTag = await this.tagService.findByName(tagData.name);
        if (!existingTag) {
          await this.tagService.create(tagData);
          this.logger.log(`创建标签: ${tagData.name}`);
        } else {
          this.logger.log(`标签已存在: ${tagData.name}`);
        }
      }

      this.logger.log('标签数据初始化完成');
    } catch (error) {
      this.logger.error('标签数据初始化失败', error);
      throw error;
    }
  }

  /**
   * 重置标签数据（开发环境使用）
   */
  async resetTags(): Promise<void> {
    this.logger.warn('重置标签数据...');

    try {
      // 获取所有标签
      const allTags = await this.tagService.findAll({});

      // 删除所有标签
      for (const tag of allTags) {
        await this.tagService.remove(tag.id);
      }

      // 重新创建默认标签
      await this.seedTags();

      this.logger.log('标签数据重置完成');
    } catch (error) {
      this.logger.error('标签数据重置失败', error);
      throw error;
    }
  }
}
