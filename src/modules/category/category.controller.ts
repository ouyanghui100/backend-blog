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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
@ApiTags('categories')
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
  // @ApiOperation({
  //   summary: '重置分类数据',
  //   description: '删除所有现有分类并重新创建默认分类（开发环境使用）',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '重置成功',
  //   schema: {
  //     example: {
  //       success: true,
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
  })
  @ApiResponse({
    status: 201,
    description: '分类创建成功',
    schema: {
      example: {
        success: true,
        message: '分类创建成功',
        data: {
          id: 1,
          name: '前端开发',
          articleCount: 0,
          createdAt: '2024-01-15 18:30:45',
          updatedAt: '2024-01-15 18:30:45',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '分类名称已存在',
  })
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
    status: 200,
    description: '获取分类列表成功',
    schema: {
      example: {
        success: true,
        message: '获取分类列表成功',
        data: [
          {
            id: 1,
            name: '前端开发',
            articleCount: 5,
            createdAt: '2024-01-15 18:30:45',
            updatedAt: '2024-01-15 18:30:45',
          },
        ],
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
      // 统一返回空数组，避免类型不匹配
      return ApiResponseDto.success([], `获取分类列表失败：${errorMessage}`);
    }
  }

  /**
   * 获取热门分类
   */
  @ApiOperation({
    summary: '获取热门分类',
    description: '获取文章数量最多的分类列表',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '返回数量限制，默认10个',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: '获取热门分类成功',
    schema: {
      example: {
        success: true,
        message: '获取热门分类成功',
        data: [
          {
            id: 1,
            name: '前端开发',
            articleCount: 15,
            createdAt: '2024-01-15 18:30:45',
            updatedAt: '2024-01-15 18:30:45',
          },
        ],
      },
    },
  })
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
  @ApiOperation({
    summary: '获取分类统计信息',
    description: '获取分类的统计数据，包括总数和文章总数',
  })
  @ApiResponse({
    status: 200,
    description: '获取分类统计成功',
    schema: {
      example: {
        success: true,
        message: '获取分类统计成功',
        data: {
          total: 10,
          totalArticles: 25,
        },
      },
    },
  })
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
    status: 200,
    description: '获取分类详情成功',
    schema: {
      example: {
        success: true,
        message: '获取分类详情成功',
        data: {
          id: 1,
          name: '前端开发',
          articleCount: 5,
          createdAt: '2024-01-15 18:30:45',
          updatedAt: '2024-01-15 18:30:45',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '分类不存在',
  })
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
  })
  @ApiResponse({
    status: 200,
    description: '分类更新成功',
    schema: {
      example: {
        success: true,
        message: '分类更新成功',
        data: {
          id: 1,
          name: '前端开发',
          articleCount: 5,
          createdAt: '2024-01-15 18:30:45',
          updatedAt: '2024-01-16 10:20:30',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '分类名称已存在',
  })
  @ApiResponse({
    status: 404,
    description: '分类不存在',
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
    status: 204,
    description: '分类删除成功',
  })
  @ApiResponse({
    status: 400,
    description: '分类下还有文章，无法删除',
  })
  @ApiResponse({
    status: 404,
    description: '分类不存在',
  })
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
