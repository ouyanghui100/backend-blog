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
@Controller('tags')
@UsePipes(new ValidationPipe({ transform: true }))
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly tagSeedService: TagSeedService,
  ) {}

  /**
   * 初始化种子数据
   */
  @Post('seed')
  @HttpCode(HttpStatus.OK)
  async seedTags(): Promise<ApiResponseDto<null>> {
    try {
      await this.tagSeedService.seedTags();
      return ApiResponseDto.success(null, '标签种子数据初始化成功');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      return ApiResponseDto.error('标签种子数据初始化失败', errorMessage);
    }
  }

  /**
   * 创建标签
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createTagDto: CreateTagDto,
  ): Promise<ApiResponseDto<TagResponseDto>> {
    const existingTag = await this.tagService.findByName(createTagDto.name);
    if (existingTag) {
      // 这里 early return，抛出业务异常，避免类型不匹配
      throw new BadRequestException(`标签 "${createTagDto.name}" 已存在`);
    }

    const tag = await this.tagService.create(createTagDto);
    return ApiResponseDto.success(new TagResponseDto(tag), '标签创建成功');
  }

  /**
   * 获取标签列表
   */
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
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<TagResponseDto>> {
    try {
      const tag = await this.tagService.findOne(id);
      if (!tag) {
        // 抛出自定义业务异常，避免类型不匹配
        throw new NotFoundException('未找到对应标签');
      }
      return ApiResponseDto.success(
        new TagResponseDto(tag),
        '获取标签详情成功',
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      // 抛出 NotFoundException 以便全局异常过滤器处理，避免类型不匹配
      throw new NotFoundException(`获取标签详情失败：${errorMessage}`);
    }
  }

  /**
   * 更新标签
   */
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<ApiResponseDto<TagResponseDto>> {
    if (updateTagDto.name) {
      const existingTag = await this.tagService.findByName(updateTagDto.name);
      if (existingTag && existingTag.id !== id) {
        // 抛出自定义业务异常，避免类型不匹配
        throw new BadRequestException(`标签 "${updateTagDto.name}" 已存在`);
      }
    }

    const tag = await this.tagService.update(id, updateTagDto);
    return ApiResponseDto.success(new TagResponseDto(tag), '标签更新成功');
  }

  /**
   * 删除标签
   */
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
      // 抛出 NotFoundException 以便全局异常过滤器处理，避免类型不匹配
      throw new NotFoundException(`删除标签失败：${errorMessage}`);
    }
  }
}
