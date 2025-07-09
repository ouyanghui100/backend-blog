import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';

/**
 * 文章分类实体
 * 简化的分类结构
 */
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  // === 基础信息 ===
  @Column({ length: 100, comment: '分类名称' })
  name: string;

  // === 关联文章 ===
  @OneToMany(() => Article, article => article.category)
  articles: Article[];

  // === 统计信息 ===
  @Column({ default: 0, comment: '文章数量' })
  articleCount: number;

  // === 时间字段 ===
  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
