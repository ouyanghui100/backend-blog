import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/dto/base-response.dto';
import { Category } from '../../../entities/category.entity';

/**
 * 分类响应 DTO
 */
export class CategoryResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: '分类ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '分类名称',
    example: '前端开发',
  })
  name: string;

  @ApiProperty({
    description: '文章数量',
    example: 5,
  })
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
