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
  Post,
  Put,
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
 */
@ApiTags('tags')
@Controller('tags')
@UsePipes(new ValidationPipe({ transform: true }))
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly tagSeedService: TagSeedService,
  ) {}

  /**
   * 重置标签数据（开发环境使用）
   * 会删除所有现有标签并重新创建默认标签
   */
  // @ApiOperation({
  //   summary: '重置标签数据',
  //   description: '删除所有现有标签并重新创建默认标签（开发环境使用）',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '重置成功',
  //   schema: {
  //     example: {
  //       success: true,
  //       message: '标签数据重置成功',
  //       data: null,
  //     },
  //   },
  // })
  // @Post('reset')
  // @HttpCode(HttpStatus.OK)
  // async resetTags(): Promise<ApiResponseDto<null>> {
  //   await this.tagSeedService.resetTags();
  //   return ApiResponseDto.success(null, '标签数据重置成功');
  // }

  /**
   * 创建标签
   */
  @ApiOperation({
    summary: '创建标签',
    description: '创建一个新的标签',
  })
  @ApiBody({
    type: CreateTagDto,
    description: '创建标签的请求体',
  })
  @ApiResponse({
    status: 201,
    description: '标签创建成功',
    schema: {
      example: {
        success: true,
        message: '标签创建成功',
        data: {
          id: 1,
          name: 'JavaScript',
          usageCount: 0,
          createdAt: '2024-01-15 18:30:45',
          updatedAt: '2024-01-15 18:30:45',
          lastUsedAt: null,
          isPopular: false,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '标签名称已存在',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTagDto: CreateTagDto,
  ): Promise<ApiResponseDto<TagResponseDto>> {
    const existingTag = await this.tagService.findByName(createTagDto.name);
    if (existingTag) {
      throw new BadRequestException(`标签 "${createTagDto.name}" 已存在`);
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
    schema: {
      example: {
        success: true,
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
      // 统一返回空数组，避免类型不匹配
      return ApiResponseDto.success([], `获取标签列表失败：${errorMessage}`);
    }
  }

  /**
   * 获取热门标签
   */
  @ApiOperation({
    summary: '获取热门标签',
    description: '获取使用次数最多的标签列表',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '返回数量限制，默认10个',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: '获取热门标签成功',
    schema: {
      example: {
        success: true,
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
      },
    },
  })
  @Get('popular')
  async getPopular(
    @Query('limit') limitQuery?: string,
  ): Promise<ApiResponseDto<TagResponseDto[]>> {
    try {
      const limit = limitQuery ? parseInt(limitQuery, 10) : 10;
      const tags = await this.tagService.getPopularTags(limit);
      const result = tags.map(tag => new TagResponseDto(tag));
      return ApiResponseDto.success(result, '获取热门标签成功');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      // 统一返回空数组，避免类型不匹配
      return ApiResponseDto.success([], `获取热门标签失败：${errorMessage}`);
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
    schema: {
      example: {
        success: true,
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
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '标签不存在',
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<TagResponseDto>> {
    try {
      const tag = await this.tagService.findOne(id);
      if (!tag) {
        throw new NotFoundException('未找到对应标签');
      }
      return ApiResponseDto.success(
        new TagResponseDto(tag),
        '获取标签详情成功',
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new NotFoundException(`获取标签详情失败：${errorMessage}`);
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
  })
  @ApiResponse({
    status: 200,
    description: '标签更新成功',
    schema: {
      example: {
        success: true,
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
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '标签名称已存在',
  })
  @ApiResponse({
    status: 404,
    description: '标签不存在',
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<ApiResponseDto<TagResponseDto>> {
    if (updateTagDto.name) {
      const existingTag = await this.tagService.findByName(updateTagDto.name);
      if (existingTag && existingTag.id !== id) {
        throw new BadRequestException(`标签 "${updateTagDto.name}" 已存在`);
      }
    }

    const tag = await this.tagService.update(id, updateTagDto);
    return ApiResponseDto.success(new TagResponseDto(tag), '标签更新成功');
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
    status: 204,
    description: '标签删除成功',
  })
  @ApiResponse({
    status: 404,
    description: '标签不存在',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<null>> {
    try {
      await this.tagService.remove(id);
      return ApiResponseDto.success(null, '标签删除成功');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      throw new NotFoundException(`删除标签失败：${errorMessage}`);
    }
  }
}
