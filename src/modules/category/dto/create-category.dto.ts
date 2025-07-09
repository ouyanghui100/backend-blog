import { IsString, Length } from 'class-validator';

/**
 * 创建分类 DTO
 */
export class CreateCategoryDto {
  @IsString({ message: '分类名称必须是字符串' })
  @Length(1, 100, { message: '分类名称长度必须在1-100个字符之间' })
  name: string;
}
