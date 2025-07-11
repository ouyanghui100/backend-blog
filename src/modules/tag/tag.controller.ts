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
import {
  ApiResponseDto,
  CreateTagDto,
  QueryTagDto,
  TagResponseDto,
  UpdateTagDto,
} from './dto';
import { TagSeedService } from './tag-seed.service';
import { TagService } from './tag.service';

/**
 * 标签控制器
 * 提供标签相关的 RESTful API
 * 后台访问需要JWT认证，游客只能执行GET操作
 */
@ApiTags('tags')
@Controller('tags')
@UseGuards(JwtAuthGuard, MethodGuard) // 添加JWT认证和方法权限守卫
@ApiBearerAuth() // 标记需要Bearer Token认证
@UsePipes(new ValidationPipe({ transform: true }))
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly tagSeedService: TagSeedService,
  ) {}

  /**
   * 创建标签
   */
  @ApiOperation({
    summary: '创建标签',
    description: '创建一个新的标签',
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '标签创建成功',
    schema: {
      type: 'object',
      required: ['code', 'message', 'data', 'timestamp'],
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '标签创建成功' },
        data: {
          type: 'object',
          required: ['id', 'name', 'usageCount', 'createdAt', 'isPopular'],
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'JavaScript' },
            usageCount: { type: 'number', example: 0 },
            createdAt: { type: 'string', example: '2024-01-15 18:30:45' },
            updatedAt: { type: 'string', nullable: true, example: null },
            lastUsedAt: { type: 'string', nullable: true, example: null },
            isPopular: { type: 'boolean', example: false },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @ApiBody({
    type: CreateTagDto,
    description: '创建标签的请求体',
    examples: {
      basic: {
        summary: '基本创建（使用默认时间）',
        value: {
          name: 'JavaScript',
        },
      },
      withTime: {
        summary: '指定创建时间',
        value: {
          name: 'JavaScript',
          createdAt: '2024-01-15 18:30:45',
        },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.CONFLICT,
    description: '标签名称已存在',
    schema: {
      example: {
        code: StatusCodes.CONFLICT,
        message: '标签 "JavaScript" 已存在',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @Post()
  async create(
    @Body() createTagDto: CreateTagDto,
  ): Promise<ApiResponseDto<TagResponseDto>> {
    const existingTag = await this.tagService.findByName(createTagDto.name);
    if (existingTag) {
      return ApiResponseDto.resourceExists(
        `标签 "${createTagDto.name}" 已存在`,
      );
    }

    const tag = await this.tagService.create(createTagDto);
    return ApiResponseDto.success(new TagResponseDto(tag), '标签创建成功');
  }

  /**
   * 获取标签列表
   */
  @ApiOperation({
    summary: '获取标签列表',
    description: '获取所有标签列表，支持搜索功能',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: '搜索关键词，按标签名称模糊搜索',
    example: 'JavaScript',
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '获取标签列表成功',
    schema: {
      type: 'object',
      required: ['code', 'message', 'data', 'timestamp'],
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '获取标签列表成功' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            required: [
              'id',
              'name',
              'usageCount',
              'createdAt',
              'updatedAt',
              'lastUsedAt',
              'isPopular',
            ],
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'JavaScript' },
              usageCount: { type: 'number', example: 5 },
              createdAt: { type: 'string', example: '2024-01-15 18:30:45' },
              updatedAt: { type: 'string', example: '2024-01-15 18:30:45' },
              lastUsedAt: { type: 'string', example: '2024-01-16 10:20:30' },
              isPopular: { type: 'boolean', example: true },
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
        message: '获取标签列表失败：数据库连接错误',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @Get()
  async findAll(
    @Query() queryDto: QueryTagDto,
  ): Promise<ApiResponseDto<TagResponseDto[]>> {
    try {
      const tags = await this.tagService.findAll(queryDto);
      const result = tags.map(tag => new TagResponseDto(tag));
      return ApiResponseDto.success(result, '获取标签列表成功');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return ApiResponseDto.internalError(`获取标签列表失败：${errorMessage}`);
    }
  }

  /**
   * 获取热门标签
   */
  @ApiOperation({
    summary: '获取热门标签',
    description:
      '获取所有使用次数达到指定阈值的热门标签（被文章引用次数多的标签）',
  })
  @ApiQuery({
    name: 'minUsage',
    required: false,
    description: '最小使用次数阈值，默认10次（被文章引用10次以上算热门）',
    example: 10,
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
            required: [
              'id',
              'name',
              'usageCount',
              'createdAt',
              'updatedAt',
              'lastUsedAt',
              'isPopular',
            ],
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'JavaScript' },
              usageCount: { type: 'number', example: 15 },
              createdAt: { type: 'string', example: '2024-01-15 18:30:45' },
              updatedAt: { type: 'string', example: '2024-01-15 18:30:45' },
              lastUsedAt: { type: 'string', example: '2024-01-16 10:20:30' },
              isPopular: { type: 'boolean', example: true },
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
        message: '获取热门标签失败：数据库查询错误',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @Get('popular')
  async getPopular(
    @Query('minUsage') minUsageQuery?: number,
  ): Promise<ApiResponseDto<TagResponseDto[]>> {
    try {
      const minUsage = minUsageQuery && minUsageQuery > 0 ? minUsageQuery : 10;
      const tags = await this.tagService.getPopularTags(minUsage);
      const result = tags.map(tag => new TagResponseDto(tag));
      return ApiResponseDto.success(
        result,
        `获取热门标签成功，共找到 ${result.length} 个热门标签`,
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return ApiResponseDto.internalError(`获取热门标签失败：${errorMessage}`);
    }
  }

  /**
   * 根据ID获取标签
   */
  @ApiOperation({
    summary: '获取标签详情',
    description: '根据标签ID获取标签详细信息',
  })
  @ApiParam({
    name: 'id',
    description: '标签ID',
    example: 1,
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '获取标签详情成功',
    schema: {
      type: 'object',
      required: ['code', 'message', 'data', 'timestamp'],
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '获取标签详情成功' },
        data: {
          type: 'object',
          required: [
            'id',
            'name',
            'usageCount',
            'createdAt',
            'updatedAt',
            'lastUsedAt',
            'isPopular',
          ],
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'JavaScript' },
            usageCount: { type: 'number', example: 5 },
            createdAt: { type: 'string', example: '2024-01-15 18:30:45' },
            updatedAt: { type: 'string', example: '2024-01-15 18:30:45' },
            lastUsedAt: { type: 'string', example: '2024-01-16 10:20:30' },
            isPopular: { type: 'boolean', example: true },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: '标签不存在',
    schema: {
      example: {
        code: StatusCodes.NOT_FOUND,
        message: 'ID为 1 的标签不存在',
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
        message: '获取标签详情失败：数据库查询错误',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<TagResponseDto>> {
    try {
      const tag = await this.tagService.findOne(id);
      return ApiResponseDto.success(
        new TagResponseDto(tag),
        '获取标签详情成功',
      );
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        return ApiResponseDto.resourceNotFound(error.message);
      }
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return ApiResponseDto.internalError(`获取标签详情失败：${errorMessage}`);
    }
  }

  /**
   * 更新标签
   */
  @ApiOperation({
    summary: '更新标签',
    description: '根据标签ID更新标签信息',
  })
  @ApiParam({
    name: 'id',
    description: '标签ID',
    example: 1,
  })
  @ApiBody({
    type: UpdateTagDto,
    description: '更新标签的请求体',
    examples: {
      basic: {
        summary: '基本更新（使用默认时间）',
        value: {
          name: 'TypeScript',
        },
      },
      withTime: {
        summary: '指定更新时间',
        value: {
          name: 'TypeScript',
          updatedAt: '2024-01-16 10:20:30',
        },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '标签更新成功',
    schema: {
      type: 'object',
      required: ['code', 'message', 'data', 'timestamp'],
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '标签更新成功' },
        data: {
          type: 'object',
          required: [
            'id',
            'name',
            'usageCount',
            'createdAt',
            'updatedAt',
            'lastUsedAt',
            'isPopular',
          ],
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'JavaScript' },
            usageCount: { type: 'number', example: 5 },
            createdAt: { type: 'string', example: '2024-01-15 18:30:45' },
            updatedAt: { type: 'string', example: '2024-01-16 10:20:30' },
            lastUsedAt: { type: 'string', example: '2024-01-16 10:20:30' },
            isPopular: { type: 'boolean', example: true },
          },
        },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.CONFLICT,
    description: '标签名称已存在',
    schema: {
      example: {
        code: StatusCodes.CONFLICT,
        message: '标签 "TypeScript" 已存在',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: '标签不存在',
    schema: {
      example: {
        code: StatusCodes.NOT_FOUND,
        message: 'ID为 1 的标签不存在',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<ApiResponseDto<TagResponseDto>> {
    if (updateTagDto.name) {
      const existingTag = await this.tagService.findByName(updateTagDto.name);
      if (existingTag && existingTag.id !== id) {
        return ApiResponseDto.resourceExists(
          `标签 "${updateTagDto.name}" 已存在`,
        );
      }
    }

    try {
      const tag = await this.tagService.update(id, updateTagDto);
      return ApiResponseDto.success(new TagResponseDto(tag), '标签更新成功');
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        return ApiResponseDto.resourceNotFound(error.message);
      }
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return ApiResponseDto.internalError(`更新标签失败：${errorMessage}`);
    }
  }

  /**
   * 删除标签
   */
  @ApiOperation({
    summary: '删除标签',
    description: '根据标签ID删除标签',
  })
  @ApiParam({
    name: 'id',
    description: '标签ID',
    example: 1,
  })
  @ApiResponse({
    status: StatusCodes.SUCCESS,
    description: '标签删除成功',
    schema: {
      type: 'object',
      required: ['code', 'message', 'data', 'timestamp'],
      properties: {
        code: { type: 'number', example: StatusCodes.SUCCESS },
        message: { type: 'string', example: '标签删除成功' },
        data: { type: 'null', example: null },
        timestamp: { type: 'string', example: '2024-01-15 18:30:45' },
      },
    },
  })
  @ApiResponse({
    status: StatusCodes.NOT_FOUND,
    description: '标签不存在',
    schema: {
      example: {
        code: StatusCodes.NOT_FOUND,
        message: 'ID为 1 的标签不存在',
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
      await this.tagService.remove(id);
      return ApiResponseDto.success(null, '标签删除成功');
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        return ApiResponseDto.resourceNotFound(error.message);
      }
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return ApiResponseDto.internalError(`删除标签失败：${errorMessage}`);
    }
  }
}
