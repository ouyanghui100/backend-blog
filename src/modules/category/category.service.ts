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
import { Category } from '../../entities/category.entity';
import { CreateCategoryDto, QueryCategoryDto, UpdateCategoryDto } from './dto';

/**
 * 分类服务层
 * 负责分类的业务逻辑处理
 */
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * 创建分类
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create({
      name: createCategoryDto.name,
      // 优先使用前端传的创建时间，没有的话使用当前时间
      createdAt:
        DateUtil.parseDateTime(createCategoryDto.createdAt) || DateUtil.now(),
    });
    return await this.categoryRepository.save(category);
  }

  /**
   * 查询分类列表（支持搜索）
   */
  async findAll(queryDto: QueryCategoryDto): Promise<Category[]> {
    const { search } = queryDto;

    // 构建查询条件
    const where: FindOptionsWhere<Category> = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }

    // 构建查询选项
    const options: FindManyOptions<Category> = {
      where,
      // order: { name: 'ASC' },
    };
    return await this.categoryRepository.find(options);
  }

  /**
   * 根据ID查询分类
   */
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['articles'],
    });

    if (!category) {
      throw new NotFoundException(`ID为 ${id} 的分类不存在`);
    }

    return category;
  }

  /**
   * 根据名称查询分类
   */
  async findByName(name: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({
      where: { name },
    });
  }

  /**
   * 获取热门分类（按文章数量排序）
   * 返回所有文章数量大于等于10的分类
   */
  async getPopularCategories(
    minArticleCount: number = 10,
  ): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: { articleCount: MoreThanOrEqual(minArticleCount) },
      // order: { articleCount: 'DESC' },
    });
  }

  /**
   * 更新分类
   */
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    // 更新名称（如果提供）
    if (updateCategoryDto.name) {
      category.name = updateCategoryDto.name;
    }

    // 设置更新时间：优先使用前端传的时间，没有的话使用当前时间
    category.updatedAt =
      DateUtil.parseDateTime(updateCategoryDto.updatedAt) || DateUtil.now();

    return await this.categoryRepository.save(category);
  }

  /**
   * 增加分类文章数量
   */
  async incrementArticleCount(id: number): Promise<void> {
    await this.categoryRepository.update(
      { id },
      {
        articleCount: () => 'articleCount + 1',
        updatedAt: DateUtil.now(),
      },
    );
  }

  /**
   * 减少分类文章数量
   */
  async decrementArticleCount(id: number): Promise<void> {
    await this.categoryRepository.update(
      { id },
      {
        articleCount: () => 'articleCount - 1',
        updatedAt: DateUtil.now(),
      },
    );
  }

  /**
   * 删除分类
   */
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);

    // 检查是否有文章使用此分类
    if (category.articleCount > 0) {
      throw new Error(
        `分类 "${category.name}" 下还有 ${category.articleCount} 篇文章，无法删除`,
      );
    }

    await this.categoryRepository.remove(category);
  }

  /**
   * 获取分类统计信息
   */
  async getStatistics(): Promise<{
    total: number;
    totalArticles: number;
  }> {
    const [total, result] = await Promise.all([
      this.categoryRepository.count(),
      this.categoryRepository
        .createQueryBuilder('category')
        .select('SUM(category.articleCount)', 'sum')
        .getRawOne(),
    ]);

    return {
      total,
      totalArticles: parseInt(String(result?.sum || '0'), 10),
    };
  }
}
