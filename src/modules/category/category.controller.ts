import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategorySeedService } from './category-seed.service';
import { CategoryService } from './category.service';
import {
  ApiResponseDto,
  CategoryResponseDto,
  CreateCategoryDto,
  QueryCategoryDto,
  UpdateCategoryDto,
} from './dto';

/**
 * 分类控制器
 * 提供分类相关的 RESTful API
 */
@Controller('categories')
@UsePipes(new ValidationPipe({ transform: true }))
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly categorySeedService: CategorySeedService,
  ) {}

  /**
   * 重置分类数据（开发环境使用）
   * 会删除所有现有分类并重新创建默认分类
   */
  @Post('reset')
  @HttpCode(HttpStatus.OK)
  async resetCategories(): Promise<ApiResponseDto<null>> {
    await this.categorySeedService.resetCategories();
    return ApiResponseDto.success(null, '分类数据重置成功');
  }

  /**
   * 创建分类
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ApiResponseDto<CategoryResponseDto>> {
    const existingCategory = await this.categoryService.findByName(
      createCategoryDto.name,
    );
    if (existingCategory) {
      throw new BadRequestException(`分类 "${createCategoryDto.name}" 已存在`);
    }

    const category = await this.categoryService.create(createCategoryDto);
    return ApiResponseDto.success(
      new CategoryResponseDto(category),
      '分类创建成功',
    );
  }

  /**
   * 获取分类列表
   */
  @Get()
  async findAll(
    @Query() queryDto: QueryCategoryDto,
  ): Promise<ApiResponseDto<CategoryResponseDto[]>> {
    try {
      const categories = await this.categoryService.findAll(queryDto);
      const result = categories.map(
        category => new CategoryResponseDto(category),
      );
      return ApiResponseDto.success(result, '获取分类列表成功');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      // 统一返回空数组，避免类型不匹配
      return ApiResponseDto.success([], `获取分类列表失败：${errorMessage}`);
    }
  }

  /**
   * 获取热门分类
   */
  @Get('popular')
  async getPopular(
    @Query('limit') limitQuery?: string,
  ): Promise<ApiResponseDto<CategoryResponseDto[]>> {
    try {
      const limit = limitQuery ? parseInt(limitQuery, 10) : 10;
      const categories = await this.categoryService.getPopularCategories(limit);
      const result = categories.map(
        category => new CategoryResponseDto(category),
      );
      return ApiResponseDto.success(result, '获取热门分类成功');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      // 统一返回空数组，避免类型不匹配
      return ApiResponseDto.success([], `获取热门分类失败：${errorMessage}`);
    }
  }

  /**
   * 获取分类统计信息
   */
  @Get('statistics')
  async getStatistics(): Promise<
    ApiResponseDto<{
      total: number;
      totalArticles: number;
    }>
  > {
    const statistics = await this.categoryService.getStatistics();
    return ApiResponseDto.success(statistics, '获取分类统计成功');
  }

  /**
   * 根据ID获取分类
   */
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<CategoryResponseDto>> {
    try {
      const category = await this.categoryService.findOne(id);
      if (!category) {
        throw new NotFoundException('未找到对应分类');
      }
      return ApiResponseDto.success(
        new CategoryResponseDto(category),
        '获取分类详情成功',
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new NotFoundException(`获取分类详情失败：${errorMessage}`);
    }
  }

  /**
   * 更新分类
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ApiResponseDto<CategoryResponseDto>> {
    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryService.findByName(
        updateCategoryDto.name,
      );
      if (existingCategory && existingCategory.id !== id) {
        throw new BadRequestException(
          `分类 "${updateCategoryDto.name}" 已存在`,
        );
      }
    }

    const category = await this.categoryService.update(id, updateCategoryDto);
    return ApiResponseDto.success(
      new CategoryResponseDto(category),
      '分类更新成功',
    );
  }

  /**
   * 删除分类
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<null>> {
    try {
      await this.categoryService.remove(id);
      return ApiResponseDto.success(null, '分类删除成功');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new BadRequestException(`删除分类失败：${errorMessage}`);
    }
  }
}
