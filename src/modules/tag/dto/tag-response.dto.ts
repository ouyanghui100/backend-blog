import { Tag } from '../../../entities/tag.entity';

/**
 * 标签响应 DTO
 */
export class TagResponseDto {
  id: number;
  name: string;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
  isPopular: boolean;

  constructor(tag: Tag) {
    this.id = tag.id;
    this.name = tag.name;
    this.usageCount = tag.usageCount;
    this.createdAt = tag.createdAt;
    this.updatedAt = tag.updatedAt;
    this.lastUsedAt = tag.lastUsedAt;
    this.isPopular = tag.isPopular;
  }
}

/**
 * 分页响应 DTO
 */
export class PaginatedTagResponseDto {
  data: TagResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;

  constructor(tags: Tag[], total: number, page: number, limit: number) {
    this.data = tags.map(tag => new TagResponseDto(tag));
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
  }
}

/**
 * API 统一响应格式
 */
export class ApiResponseDto<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;

  constructor(success: boolean, message: string, data?: T, error?: string) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  static success<T>(data: T, message: string = '操作成功'): ApiResponseDto<T> {
    return new ApiResponseDto(true, message, data);
  }

  static error<T>(message: string, error?: string): ApiResponseDto<T | null> {
    return new ApiResponseDto<T | null>(false, message, null, error);
  }
}
