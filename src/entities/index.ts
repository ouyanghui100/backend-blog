/**
 * 实体导出文件
 * 统一管理所有数据库实体的导出
 */

// 导入所有实体
import { Article, ArticleStatus } from './article.entity';
import { Category } from './category.entity';
import { Comment, CommentStatus } from './comment.entity';
import { Tag } from './tag.entity';
import { User, UserRole } from './user.entity';

// 用户相关
export { User, UserRole };

// 文章相关
export { Article, ArticleStatus };

// 分类相关
export { Category };

// 标签相关
export { Tag };

// 评论相关
export { Comment, CommentStatus };

/**
 * 所有实体的数组
 * 用于 TypeORM 配置
 */
export const entities = [User, Article, Category, Tag, Comment];
