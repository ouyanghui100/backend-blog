import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

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

  @ApiPropertyOptional({
    description: '创建时间（可选，不传则使用当前时间）',
    example: '2024-01-15 18:30:45',
    type: String,
  })
  @IsOptional()
  @IsDateString({}, { message: '创建时间格式必须为有效的日期字符串' })
  createdAt?: string;

  @ApiPropertyOptional({
    description: '更新时间（可选，创建时通常不设置）',
    example: '2024-01-15 18:30:45',
    type: String,
  })
  @IsOptional()
  @IsDateString({}, { message: '更新时间格式必须为有效的日期字符串' })
  updatedAt?: string;
}
