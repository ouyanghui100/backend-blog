import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

/**
 * 查询标签 DTO
 */
export class QueryTagDto {
  @ApiPropertyOptional({
    description: '搜索关键词，按标签名称模糊搜索',
    example: 'JavaScript',
  })
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  search?: string;
}
