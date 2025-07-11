import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../auth/decorators/public.decorator';
import { StatusCodes } from '../../common/constants/status-codes';
import { ApiResponseDto } from '../../common/dto/api-response.dto';
import { CategoryService } from '../category/category.service';
import { CategoryResponseDto, QueryCategoryDto } from '../category/dto';
import { QueryTagDto, TagResponseDto } from '../tag/dto';
import { TagService } from '../tag/tag.service';

/**
 * 前台控制器
 * 提供前台页面需要的公开API接口（无需认证）
 */
@ApiTags('frontend')
@Controller('frontend')
@Public() // 整个控制器都是公开的，不需要认证
export class FrontendController {
  constructor(
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
  ) {}

  /**
   * 获取前台标签列表
   */
  @ApiOperation({
    summary: '获取前台标签列表',
    description: '前台页面获取标签列表，无需认证',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: '搜索关键词',
    example: 'JavaScript',
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '获取标签列表成功',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '获取标签列表成功' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'JavaScript' },
              usageCount: { type: 'number', example: 15 },
              createdAt: { type: 'string', example: '2024-01-15 18:30:45' },
              updatedAt: { type: 'string', example: '2024-01-16 10:20:30' },
              lastUsedAt: { type: 'string', example: '2024-01-16 10:20:30' },
              isPopular: { type: 'boolean', example: true },
            },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @Get('tags')
  async getTags(
    @Query() queryDto: QueryTagDto,
  ): Promise<ApiResponseDto<TagResponseDto[]>> {
    const tags = await this.tagService.findAll(queryDto);
    const result = tags.map(tag => new TagResponseDto(tag));
    return ApiResponseDto.success(result, '获取标签列表成功');
  }

  /**
   * 获取前台热门标签
   */
  @ApiOperation({
    summary: '获取前台热门标签',
    description: '前台页面获取热门标签，无需认证，可指定返回数量',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '返回的热门标签数量，默认10个',
    example: 10,
    type: Number,
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '获取热门标签成功',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '获取热门标签成功' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'JavaScript' },
              usageCount: { type: 'number', example: 25 },
              createdAt: { type: 'string', example: '2024-01-15 18:30:45' },
              updatedAt: { type: 'string', example: '2024-01-16 10:20:30' },
              lastUsedAt: { type: 'string', example: '2024-01-16 10:20:30' },
              isPopular: { type: 'boolean', example: true },
            },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @Get('tags/popular')
  async getPopularTags(
    @Query('limit') limit?: number,
  ): Promise<ApiResponseDto<TagResponseDto[]>> {
    const limitNumber = limit && limit > 0 ? limit : 10;
    const tags = await this.tagService.getPopularTags(limitNumber);
    const result = tags.map(tag => new TagResponseDto(tag));
    return ApiResponseDto.success(result, '获取热门标签成功');
  }

  /**
   * 获取前台分类列表
   */
  @ApiOperation({
    summary: '获取前台分类列表',
    description: '前台页面获取分类列表，无需认证',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: '搜索关键词',
    example: '前端',
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '获取分类列表成功',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '获取分类列表成功' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: '前端开发' },
              articleCount: { type: 'number', example: 15 },
              createdAt: { type: 'string', example: '2024-01-15 18:30:45' },
              updatedAt: { type: 'string', example: '2024-01-16 10:20:30' },
            },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @Get('categories')
  async getCategories(
    @Query() queryDto: QueryCategoryDto,
  ): Promise<ApiResponseDto<CategoryResponseDto[]>> {
    const categories = await this.categoryService.findAll(queryDto);
    const result = categories.map(
      category => new CategoryResponseDto(category),
    );
    return ApiResponseDto.success(result, '获取分类列表成功');
  }

  /**
   * 获取前台热门分类
   */
  @ApiOperation({
    summary: '获取前台热门分类',
    description: '前台页面获取热门分类，无需认证，可指定返回数量',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '返回的热门分类数量，默认10个',
    example: 10,
    type: Number,
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '获取热门分类成功',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '获取热门分类成功' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: '前端开发' },
              articleCount: { type: 'number', example: 15 },
              createdAt: { type: 'string', example: '2024-01-15 18:30:45' },
              updatedAt: { type: 'string', example: '2024-01-16 10:20:30' },
            },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @Get('categories/popular')
  async getPopularCategories(
    @Query('limit') limit?: number,
  ): Promise<ApiResponseDto<CategoryResponseDto[]>> {
    const limitNumber = limit && limit > 0 ? limit : 10;
    const categories =
      await this.categoryService.getPopularCategories(limitNumber);
    const result = categories.map(
      category => new CategoryResponseDto(category),
    );
    return ApiResponseDto.success(result, '获取热门分类成功');
  }
}
