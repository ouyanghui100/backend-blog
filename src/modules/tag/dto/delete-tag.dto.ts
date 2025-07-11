import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * 删除标签 DTO
 */
export class DeleteTagDto {
  @ApiProperty({
    description: '标签ID',
    example: 1,
  })
  @IsNotEmpty({ message: '标签ID不能为空' })
  @IsNumber({}, { message: '标签ID必须是数字' })
  id: number;
}
