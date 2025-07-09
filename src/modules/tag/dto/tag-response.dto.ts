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

    // 使用父类方法格式化基础时间字段（createdAt和updatedAt）
    this.formatBaseTimeFields(tag);
  }
}
