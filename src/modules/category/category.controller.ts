import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MethodGuard } from '../../auth/guards/method.guard';
import { StatusCodes } from '../../common/constants/status-codes';
import { CategorySeedService } from './category-seed.service';
import { CategoryService } from './category.service';
import {
  ApiResponseDto,
  CategoryResponseDto,
  CategoryStatisticsDto,
  CreateCategoryDto,
  QueryCategoryDto,
  UpdateCategoryDto,
} from './dto';

/**
 * 分类控制器
 * 提供分类相关的 RESTful API
 * 后台访问需要JWT认证，游客只能执行GET操作
 */
@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, MethodGuard) // 添加JWT认证和方法权限守卫
@ApiBearerAuth() // 标记需要Bearer Token认证
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
  // @ApiOperation({
  //   summary: '重置分类数据',
  //   description: '删除所有现有分类并重新创建默认分类（开发环境使用）',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '重置成功',
  //   schema: {
  //     example: {
  //       code: 200,
  //       message: '分类数据重置成功',
  //       data: null,
  //     },
  //   },
  // })
  // @Post('reset')
  // @HttpCode(HttpStatus.OK)
  // async resetCategories(): Promise<ApiResponseDto<null>> {
  //   await this.categorySeedService.resetCategories();
  //   return ApiResponseDto.success(null, '分类数据重置成功');
  // }

  /**
   * 创建分类
   */
  @ApiOperation({
    summary: '创建分类',
    description: '创建一个新的分类',
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: '创建分类的请求体',
    examples: {
      basic: {
        summary: '基本创建（使用默认时间）',
        value: {
          name: '前端开发',
        },
      },
      withTime: {
        summary: '指定创建时间',
        value: {
          name: '前端开发',
          createdAt: '2024-01-15 18:30:45',
        },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '分类创建成功',
    schema: {
      type: 'object',
      required: ['code', 'message', 'data', 'timestamp'],
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '分类创建成功' },
        data: {
          type: 'object',
          required: ['id', 'name', 'articleCount', 'createdAt'],
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: '前端开发' },
            articleCount: { type: 'number', example: 0 },
            createdAt: { type: 'string', example: '2024-01-15 18:30:45' },
            updatedAt: { type: 'string', nullable: true, example: null },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.CONFLICT,
    description: '分类名称已存在',
    schema: {
      example: {
        code: StatusCodes.CONFLICT,
        message: '分类 "前端开发" 已存在',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ApiResponseDto<CategoryResponseDto>> {
    const existingCategory = await this.categoryService.findByName(
      createCategoryDto.name,
    );
    if (existingCategory) {
      return ApiResponseDto.conflict(`分类 "${createCategoryDto.name}" 已存在`);
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
  @ApiOperation({
    summary: '获取分类列表',
    description: '获取所有分类列表，支持搜索功能',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: '搜索关键词，按分类名称模糊搜索',
    example: '前端',
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '获取分类列表成功',
    schema: {
      type: 'object',
      required: ['code', 'message', 'data', 'timestamp'],
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '获取分类列表成功' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'name', 'articleCount', 'createdAt', 'updatedAt'],
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: '前端开发' },
              articleCount: { type: 'number', example: 5 },
              createdAt: { type: 'string', example: '2024-01-15 18:30:45' },
              updatedAt: { type: 'string', example: '2024-01-15 18:30:45' },
            },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.INTERNAL_ERROR,
    description: '服务器内部错误',
    schema: {
      example: {
        code: StatusCodes.INTERNAL_ERROR,
        message: '获取分类列表失败：数据库连接错误',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
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
      return ApiResponseDto.internalError(`获取分类列表失败：${errorMessage}`);
    }
  }

  /**
   * 获取热门分类
   */
  @ApiOperation({
    summary: '获取热门分类',
    description: '获取所有文章数量达到指定阈值的热门分类（包含文章数多的分类）',
  })
  @ApiQuery({
    name: 'minArticles',
    required: false,
    description: '最小文章数量阈值，默认10篇（分类下有10篇以上文章算热门）',
    example: 10,
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '获取热门分类成功',
    schema: {
      type: 'object',
      required: ['code', 'message', 'data', 'timestamp'],
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '获取热门分类成功' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'name', 'articleCount', 'createdAt', 'updatedAt'],
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: '前端开发' },
              articleCount: { type: 'number', example: 15 },
              createdAt: { type: 'string', example: '2024-01-15 18:30:45' },
              updatedAt: { type: 'string', example: '2024-01-15 18:30:45' },
            },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.INTERNAL_ERROR,
    description: '服务器内部错误',
    schema: {
      example: {
        code: StatusCodes.INTERNAL_ERROR,
        message: '获取热门分类失败：数据库查询错误',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @Get('popular')
  async getPopular(
    @Query('minArticles') minArticlesQuery?: number,
  ): Promise<ApiResponseDto<CategoryResponseDto[]>> {
    try {
      const minArticles =
        minArticlesQuery && minArticlesQuery > 0 ? minArticlesQuery : 10;
      const categories =
        await this.categoryService.getPopularCategories(minArticles);
      const result = categories.map(
        category => new CategoryResponseDto(category),
      );
      return ApiResponseDto.success(
        result,
        `获取热门分类成功，共找到 ${result.length} 个热门分类`,
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return ApiResponseDto.internalError(`获取热门分类失败：${errorMessage}`);
    }
  }

  /**
   * 获取分类统计信息
   */
  @ApiOperation({
    summary: '获取分类统计信息',
    description: '获取分类的统计数据，包括总数和文章总数',
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '获取分类统计成功',
    schema: {
      type: 'object',
      required: ['code', 'message', 'data', 'timestamp'],
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '获取分类统计成功' },
        data: {
          type: 'object',
          required: ['total', 'totalArticles'],
          properties: {
            total: { type: 'number', example: 10 },
            totalArticles: { type: 'number', example: 25 },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @Get('statistics')
  async getStatistics(): Promise<ApiResponseDto<CategoryStatisticsDto>> {
    const statistics = await this.categoryService.getStatistics();
    return ApiResponseDto.success(statistics, '获取分类统计成功');
  }

  /**
   * 根据ID获取分类
   */
  @ApiOperation({
    summary: '获取分类详情',
    description: '根据分类ID获取分类详细信息',
  })
  @ApiParam({
    name: 'id',
    description: '分类ID',
    example: 1,
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '获取分类详情成功',
    schema: {
      type: 'object',
      required: ['code', 'message', 'data', 'timestamp'],
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '获取分类详情成功' },
        data: {
          type: 'object',
          required: ['id', 'name', 'articleCount', 'createdAt', 'updatedAt'],
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: '前端开发' },
            articleCount: { type: 'number', example: 5 },
            createdAt: { type: 'string', example: '2024-01-15 18:30:45' },
            updatedAt: { type: 'string', example: '2024-01-15 18:30:45' },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: '分类不存在',
    schema: {
      example: {
        code: StatusCodes.NOT_FOUND,
        message: 'ID为 1 的分类不存在',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.INTERNAL_ERROR,
    description: '服务器内部错误',
    schema: {
      example: {
        code: StatusCodes.INTERNAL_ERROR,
        message: '获取分类详情失败：数据库查询错误',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<CategoryResponseDto>> {
    try {
      const category = await this.categoryService.findOne(id);
      return ApiResponseDto.success(
        new CategoryResponseDto(category),
        '获取分类详情成功',
      );
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        return ApiResponseDto.notFound(error.message);
      }
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return ApiResponseDto.internalError(`获取分类详情失败：${errorMessage}`);
    }
  }

  /**
   * 更新分类
   */
  @ApiOperation({
    summary: '更新分类',
    description: '根据分类ID更新分类信息',
  })
  @ApiParam({
    name: 'id',
    description: '分类ID',
    example: 1,
  })
  @ApiBody({
    type: UpdateCategoryDto,
    description: '更新分类的请求体',
    examples: {
      basic: {
        summary: '基本更新（使用默认时间）',
        value: {
          name: '全栈开发',
        },
      },
      withTime: {
        summary: '指定更新时间',
        value: {
          name: '全栈开发',
          updatedAt: '2024-01-16 10:20:30',
        },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '分类更新成功',
    schema: {
      type: 'object',
      required: ['code', 'message', 'data', 'timestamp'],
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '分类更新成功' },
        data: {
          type: 'object',
          required: ['id', 'name', 'articleCount', 'createdAt', 'updatedAt'],
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: '前端开发' },
            articleCount: { type: 'number', example: 5 },
            createdAt: { type: 'string', example: '2024-01-15 18:30:45' },
            updatedAt: { type: 'string', example: '2024-01-16 10:20:30' },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.CONFLICT,
    description: '分类名称已存在',
    schema: {
      example: {
        code: StatusCodes.CONFLICT,
        message: '分类 "全栈开发" 已存在',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: '分类不存在',
    schema: {
      example: {
        code: StatusCodes.NOT_FOUND,
        message: 'ID为 1 的分类不存在',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
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
        return ApiResponseDto.conflict(
          `分类 "${updateCategoryDto.name}" 已存在`,
        );
      }
    }

    try {
      const category = await this.categoryService.update(id, updateCategoryDto);
      return ApiResponseDto.success(
        new CategoryResponseDto(category),
        '分类更新成功',
      );
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        return ApiResponseDto.notFound(error.message);
      }
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return ApiResponseDto.internalError(`更新分类失败：${errorMessage}`);
    }
  }

  /**
   * 删除分类
   */
  @ApiOperation({
    summary: '删除分类',
    description: '根据分类ID删除分类（只能删除没有文章的分类）',
  })
  @ApiParam({
    name: 'id',
    description: '分类ID',
    example: 1,
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '分类删除成功',
    schema: {
      type: 'object',
      required: ['code', 'message', 'data', 'timestamp'],
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '分类删除成功' },
        data: { type: 'null', example: null },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.FORBIDDEN,
    description: '分类下还有文章，无法删除',
    schema: {
      example: {
        code: StatusCodes.FORBIDDEN,
        message: '分类下还有文章，无法删除',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: '分类不存在',
    schema: {
      example: {
        code: StatusCodes.NOT_FOUND,
        message: 'ID为 1 的分类不存在',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<null>> {
    try {
      await this.categoryService.remove(id);
      return ApiResponseDto.success(null, '分类删除成功');
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        return ApiResponseDto.notFound(error.message);
      }
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return ApiResponseDto.internalError(`删除分类失败：${errorMessage}`);
    }
  }
}
