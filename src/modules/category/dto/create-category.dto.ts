import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

/**
 * 创建分类 DTO
 */
export class CreateCategoryDto {
  @ApiProperty({
    description: '分类名称',
    example: '前端开发',
    minLength: 1,
    maxLength: 50,
  })
  @IsString({ message: '分类名称必须是字符串' })
  @Length(1, 50, { message: '分类名称长度必须在1-50个字符之间' })
  name: string;
}
