import { IsString, Length } from 'class-validator';

/**
 * 创建标签 DTO
 */
export class CreateTagDto {
  @IsString({ message: '标签名称必须是字符串' })
  @Length(1, 50, { message: '标签名称长度必须在1-50个字符之间' })
  name: string;
}
