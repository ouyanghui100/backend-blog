import { IsOptional, IsString } from 'class-validator';

/**
 * 查询分类 DTO
 */
export class QueryCategoryDto {
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  search?: string;
}
