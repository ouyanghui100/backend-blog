import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

/**
 * 更新标签 DTO
 * 注意：更新时不能修改创建时间
 */
export class UpdateTagDto {
  @ApiProperty({
    description: '标签ID',
    example: 1,
  })
  @IsNotEmpty({ message: '标签ID不能为空' })
  @IsNumber({}, { message: '标签ID必须是数字' })
  id: number;

  @ApiPropertyOptional({
    description: '标签名称',
    example: 'JavaScript',
    minLength: 1,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: '标签名称必须是字符串' })
  @Length(1, 50, { message: '标签名称长度必须在1-50个字符之间' })
  name?: string;

  @ApiPropertyOptional({
    description: '更新时间（可选，不传则使用当前时间）',
    example: '2024-01-16 10:20:30',
    type: String,
  })
  @IsOptional()
  @IsDateString({}, { message: '更新时间格式必须为有效的日期字符串' })
  updatedAt?: string;
}
