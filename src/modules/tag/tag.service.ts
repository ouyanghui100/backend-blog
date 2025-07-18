import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOptionsWhere,
  Like,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { DateUtil } from '../../common/utils/date.util';
import { Tag } from '../../entities/tag.entity';
import { CreateTagDto, QueryTagDto, UpdateTagDto } from './dto';

/**
 * 标签服务层
 * 负责标签的业务逻辑处理
 */
@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  /**
   * 创建标签
   */
  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagRepository.create({
      name: createTagDto.name,
      // 优先使用前端传的创建时间，没有的话使用当前时间
      createdAt:
        DateUtil.parseDateTime(createTagDto.createdAt) || DateUtil.now(),
    });
    return await this.tagRepository.save(tag);
  }

  /**
   * 查询标签列表（支持搜索）
   */
  async findAll(queryDto: QueryTagDto): Promise<Tag[]> {
    const { search } = queryDto;

    // 构建查询条件
    const where: FindOptionsWhere<Tag> = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }

    // 构建查询选项
    const options: FindManyOptions<Tag> = {
      where,
    };
    return await this.tagRepository.find(options);
  }

  /**
   * 根据ID查询标签
   */
  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['articles'],
    });

    if (!tag) {
      throw new NotFoundException(`ID为 ${id} 的标签不存在`);
    }

    return tag;
  }

  /**
   * 根据名称查询标签
   */
  async findByName(name: string): Promise<Tag | null> {
    return await this.tagRepository.findOne({
      where: { name },
    });
  }

  /**
   * 获取热门标签
   * 返回所有使用次数大于等于10的标签（被文章引用10次以上）
   */
  async getPopularTags(minUsageCount: number = 10): Promise<Tag[]> {
    return await this.tagRepository.find({
      where: { usageCount: MoreThanOrEqual(minUsageCount) },
      order: { usageCount: 'DESC' },
    });
  }

  /**
   * 更新标签
   */
  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);

    // 更新名称（如果提供）
    if (updateTagDto.name) {
      tag.name = updateTagDto.name;
    }

    // 设置更新时间：优先使用前端传的时间，没有的话使用当前时间
    tag.updatedAt =
      DateUtil.parseDateTime(updateTagDto.updatedAt) || DateUtil.now();

    return await this.tagRepository.save(tag);
  }

  /**
   * 增加标签使用次数
   */
  async incrementUsage(id: number): Promise<void> {
    const currentTime = DateUtil.now();
    await this.tagRepository.update(
      { id },
      {
        usageCount: () => 'usageCount + 1',
        lastUsedAt: currentTime,
        updatedAt: currentTime,
      },
    );
  }

  /**
   * 删除标签
   */
  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
  }

  /**
   * 获取标签统计信息
   */
  async getStatistics(): Promise<{
    total: number;
    popular: number;
    totalUsage: number;
  }> {
    const [total, popularTags] = await Promise.all([
      this.tagRepository.count(),
      // 使用10作为热门标签的阈值，与getPopularTags保持一致
      this.tagRepository.find({ where: { usageCount: MoreThanOrEqual(10) } }),
    ]);

    const totalUsageResult = await this.tagRepository
      .createQueryBuilder('tag')
      .select('SUM(tag.usageCount)', 'sum')
      .getRawOne();

    return {
      total,
      popular: popularTags.length,
      totalUsage: parseInt(String(totalUsageResult?.sum || '0'), 10),
    };
  }
}
