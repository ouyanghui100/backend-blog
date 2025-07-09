import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';

/**
 * 文章标签实体
 * 用于文章的标签化分类和检索
 */
@Entity('tags')
@Index(['usageCount']) // 使用频率索引，用于热门标签查询
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  // === 基础信息 ===
  @Column({ length: 50, comment: '标签名称' })
  name: string;

  // === 关联文章 ===
  @ManyToMany(() => Article, article => article.tags)
  articles: Article[];

  // === 统计和状态 ===
  @Column({ default: 0, comment: '使用次数/关联文章数' })
  usageCount: number;

  // === 时间字段 ===
  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true, comment: '最后使用时间' })
  lastUsedAt?: Date;

  /**
   * 实用方法：检查是否为热门标签
   * 定义：使用次数 >= 5 为热门标签
   */
  get isPopular(): boolean {
    return this.usageCount >= 5;
  }
}
