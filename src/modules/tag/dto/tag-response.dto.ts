import { BaseResponseDto } from '../../../common/dto/base-response.dto';
import { DateUtil } from '../../../common/utils/date.util';
import { Tag } from '../../../entities/tag.entity';

/**
 * 标签响应 DTO
 */
export class TagResponseDto extends BaseResponseDto {
  id: number;
  name: string;
  usageCount: number;
  lastUsedAt: string | null;
  isPopular: boolean;

  constructor(tag: Tag) {
    super();
    this.id = tag.id;
    this.name = tag.name;
    this.usageCount = tag.usageCount;
    this.lastUsedAt = DateUtil.formatDateTime(tag.lastUsedAt);
    this.isPopular = tag.isPopular;

    // 使用父类方法格式化基础时间字段
    this.formatBaseTimeFields(tag);
  }
}
