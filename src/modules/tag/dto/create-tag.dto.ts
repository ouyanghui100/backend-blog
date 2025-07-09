import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

/**
 * 创建标签 DTO
 */
export class CreateTagDto {
  @ApiProperty({
    description: '标签名称',
    example: 'JavaScript',
    minLength: 1,
    maxLength: 50,
  })
  @IsString({ message: '标签名称必须是字符串' })
  @Length(1, 50, { message: '标签名称长度必须在1-50个字符之间' })
  name: string;
}
