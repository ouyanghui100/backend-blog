/**
 * 实体导出文件
 * 统一管理所有数据库实体的导出
 */

import { Article } from './article.entity';
import { Category } from './category.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

/**
 * 所有实体的数组
 * 用于 TypeORM 配置
 */
export const entities = [User, Article, Category, Tag];
