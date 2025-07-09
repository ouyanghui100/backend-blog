import { IsOptional, IsString } from 'class-validator';

/**
 * 查询标签 DTO
 */
export class QueryTagDto {
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  search?: string;
}
