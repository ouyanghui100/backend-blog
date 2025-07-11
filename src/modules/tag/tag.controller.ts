import {
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
    status: 200,
    description: '标签创建成功',
    type: ApiResponseDto<TagResponseDto>,
    schema: {
      example: {
        code: 200,
        message: '标签创建成功',
        data: {
          id: 1,
          name: 'JavaScript',
          usageCount: 0,
          createdAt: '2024-01-15 18:30:45',
          updatedAt: null, // 创建时为null
          lastUsedAt: null,
          isPopular: false,
        },
        timestamp: '2024-01-15 18:30:45',
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
    status: 303,
    description: '标签名称已存在',
    schema: {
      example: {
        code: 303,
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
    status: 200,
    description: '获取标签列表成功',
    type: ApiResponseDto<TagResponseDto[]>,
    schema: {
      example: {
        code: 200,
        message: '获取标签列表成功',
        data: [
          {
            id: 1,
            name: 'JavaScript',
            usageCount: 5,
            createdAt: '2024-01-15 18:30:45',
            updatedAt: '2024-01-15 18:30:45',
            lastUsedAt: '2024-01-16 10:20:30',
            isPopular: true,
          },
        ],
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
    status: 200,
    description: '获取热门标签成功',
    type: ApiResponseDto<TagResponseDto[]>,
    schema: {
      example: {
        code: 200,
        message: '获取热门标签成功',
        data: [
          {
            id: 1,
            name: 'JavaScript',
            usageCount: 15,
            createdAt: '2024-01-15 18:30:45',
            updatedAt: '2024-01-15 18:30:45',
            lastUsedAt: '2024-01-16 10:20:30',
            isPopular: true,
          },
        ],
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
    status: 200,
    description: '获取标签详情成功',
    type: ApiResponseDto<TagResponseDto>,
    schema: {
      example: {
        code: 200,
        message: '获取标签详情成功',
        data: {
          id: 1,
          name: 'JavaScript',
          usageCount: 5,
          createdAt: '2024-01-15 18:30:45',
          updatedAt: '2024-01-15 18:30:45',
          lastUsedAt: '2024-01-16 10:20:30',
          isPopular: true,
        },
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @ApiResponse({
    status: 302,
    description: '标签不存在',
    schema: {
      example: {
        code: 302,
        message: 'ID为 1 的标签不存在',
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
    status: 200,
    description: '标签更新成功',
    type: ApiResponseDto<TagResponseDto>,
    schema: {
      example: {
        code: 200,
        message: '标签更新成功',
        data: {
          id: 1,
          name: 'JavaScript',
          usageCount: 5,
          createdAt: '2024-01-15 18:30:45',
          updatedAt: '2024-01-16 10:20:30',
          lastUsedAt: '2024-01-16 10:20:30',
          isPopular: true,
        },
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @ApiResponse({
    status: 303,
    description: '标签名称已存在',
    schema: {
      example: {
        code: 303,
        message: '标签 "TypeScript" 已存在',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @ApiResponse({
    status: 302,
    description: '标签不存在',
    schema: {
      example: {
        code: 302,
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
    status: 200,
    description: '标签删除成功',
    schema: {
      example: {
        code: 200,
        message: '标签删除成功',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @ApiResponse({
    status: 302,
    description: '标签不存在',
    schema: {
      example: {
        code: 302,
        message: 'ID为 1 的标签不存在',
        data: null,
        timestamp: '2024-01-15 18:30:45',
      },
    },
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
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
