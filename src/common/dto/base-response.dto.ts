import { ApiProperty } from '@nestjs/swagger';
import { DateUtil } from '../utils/date.util';

/**
 * 基础时间字段接口
 */
export interface BaseTimeFields {
  createdAt: Date;
  updatedAt?: Date; // 更新时间可选，只在真正更新时才有值
}

/**
 * 基础响应 DTO
 * 提供通用的时间格式化功能
 */
export abstract class BaseResponseDto {
  @ApiProperty({
    description: '创建时间',
    example: '2024-01-15 18:30:45',
  })
  createdAt: string;

  @ApiProperty({
    description: '更新时间（只在真正更新时才有值）',
    example: '2024-01-16 10:20:30',
    nullable: true,
  })
  updatedAt: string | null; // 支持null，创建时为null

  /**
   * 格式化基础时间字段
   * @param entity - 包含时间字段的实体对象
   */
  protected formatBaseTimeFields(entity: BaseTimeFields): void {
    this.createdAt = DateUtil.formatDateTime(entity.createdAt) || '';
    // 更新时间只在真正更新时才有值
    this.updatedAt = entity.updatedAt
      ? DateUtil.formatDateTime(entity.updatedAt) || null
      : null;
  }
}
