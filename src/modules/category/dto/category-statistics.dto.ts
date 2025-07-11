import { ApiProperty } from '@nestjs/swagger';

/**
 * 分类统计响应 DTO
 */
export class CategoryStatisticsDto {
  @ApiProperty({
    description: '分类总数',
    example: 10,
  })
  total: number;

  @ApiProperty({
    description: '文章总数',
    example: 25,
  })
  totalArticles: number;
}
