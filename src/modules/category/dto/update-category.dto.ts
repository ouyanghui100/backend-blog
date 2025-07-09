import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

/**
 * 更新分类 DTO
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
