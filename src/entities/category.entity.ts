import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';

/**
 * 文章分类实体
 * 支持层级分类结构 (父分类 -> 子分类)
 */
@Entity('categories')
@Index(['slug'], { unique: true }) // slug 唯一索引
@Index(['parentId', 'sort']) // 父分类和排序优化
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  // === 基础信息 ===
  @Column({ length: 100, comment: '分类名称' })
  name: string;

  // === 关联文章 ===
  @OneToMany(() => Article, article => article.category)
  articles: Article[];

  // === 显示和排序 ===
  @Column({ default: 0, comment: '排序权重 (数字越大越靠前)' })
  sort: number;

  @Column({ default: true, comment: '是否启用' })
  isActive: boolean;

  // === 统计信息 ===
  @Column({ default: 0, comment: '文章数量' })
  articleCount: number;

  // === 时间字段 ===
  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
