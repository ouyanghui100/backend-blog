import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * 删除分类 DTO
 */
export class DeleteCategoryDto {
  @ApiProperty({
    description: '分类ID',
    example: 1,
  })
  @IsNotEmpty({ message: '分类ID不能为空' })
  @IsNumber({}, { message: '分类ID必须是数字' })
  id: number;
}
