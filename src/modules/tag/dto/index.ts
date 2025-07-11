/**
 * 标签模块 DTO 导出
 */

export { CreateTagDto } from './create-tag.dto';
export { QueryTagDto } from './query-tag.dto';
export { TagResponseDto } from './tag-response.dto';
export { UpdateTagDto } from './update-tag.dto';

// 从公共模块导出统一的响应格式
export { ApiResponseDto, StatusCodes } from '../../../common';
export type { StatusCode } from '../../../common';
