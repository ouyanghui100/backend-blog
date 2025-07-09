import { BaseResponseDto } from '../../../common/dto/base-response.dto';
import { Category } from '../../../entities/category.entity';

/**
 * 分类响应 DTO
 */
export class CategoryResponseDto extends BaseResponseDto {
  id: number;
  name: string;
  articleCount: number;

  constructor(category: Category) {
    super();
    this.id = category.id;
    this.name = category.name;
    this.articleCount = category.articleCount;

    // 使用父类方法格式化基础时间字段
    this.formatBaseTimeFields(category);
  }
}
