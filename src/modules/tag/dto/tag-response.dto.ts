import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/dto/base-response.dto';
import { Tag } from '../../../entities/tag.entity';

/**
 * 标签响应 DTO
 */
export class TagResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: '标签ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '标签名称',
    example: 'JavaScript',
  })
  name: string;

  @ApiProperty({
    description: '使用次数',
    example: 5,
  })
  usageCount: number;

  @ApiProperty({
    description: '创建时间',
    example: '2024-01-15 18:30:45',
  })
  createdAt: string;

  @ApiProperty({
    description: '更新时间',
    example: '2024-01-15 18:30:45',
  })
  updatedAt: string;

  @ApiProperty({
    description: '最后使用时间',
    example: '2024-01-16 10:20:30',
    nullable: true,
  })
  lastUsedAt: string | null;

  @ApiProperty({
    description: '是否为热门标签',
    example: true,
  })
  isPopular: boolean;

  constructor(tag: Tag) {
    super();
    this.id = tag.id;
    this.name = tag.name;
    this.usageCount = tag.usageCount;
    this.createdAt = tag.createdAt
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);
    this.updatedAt = tag.updatedAt
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);
    this.lastUsedAt = tag.lastUsedAt
      ? tag.lastUsedAt.toISOString().replace('T', ' ').substring(0, 19)
      : null;
    // 使用次数大于等于10次则认为是热门标签
    this.isPopular = tag.usageCount >= 10;

    // 使用父类方法格式化基础时间字段
    this.formatBaseTimeFields(tag);
  }
}
