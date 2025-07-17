import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Comment } from './comment.entity';
import { Tag } from './tag.entity';
import { User } from './user.entity';

/**
 * 文章状态枚举
 */
export enum ArticleStatus {
  DRAFT = 'draft', // 草稿
  PUBLISHED = 'published', // 已发布
  DELETED = 'deleted', // 已删除
}

/**
 * 文章实体
 * 支持 Markdown 格式的博客文章系统
 */
@Entity('articles')
@Index(['status', 'publishedAt']) // 为查询优化添加索引
export class Article {
  // 默认按时间排序
  @PrimaryGeneratedColumn()
  id: number;

  // === 基础信息 ===
  @Column({ length: 200, comment: '文章标题' })
  title: string;

  // @Column({ unique: true, length: 300, comment: 'SEO友好的URL段' })
  // slug?: string;

  // 如果前端没设置，采用自动截取前100字作为摘要
  @Column({ type: 'text', nullable: true, comment: '文章摘要/简介' })
  summary: string;

  @Column({ type: 'longtext', comment: '文章内容 (Markdown格式)' })
  content: string;

  // === 作者关联 ===
  // 目前只能说超级管理员，自动带入
  @Column({ comment: '作者ID' })
  authorId: number;

  @ManyToOne(() => User, user => user.articles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorId' })
  author: User;

  // === 分类关联 ===
  @Column({ nullable: true, comment: '分类ID' })
  categoryId: number;

  @ManyToOne(() => Category, (category: Category) => category.articles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  // === 标签关联 (多对多) ===
  @ManyToMany(() => Tag, tag => tag.articles)
  @JoinTable({
    name: 'article_tags',
    joinColumn: { name: 'articleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tagId', referencedColumnName: 'id' },
  })
  tags: Tag[];

  // === 评论关联 ===
  @OneToMany(() => Comment, comment => comment.article)
  comments: Comment[];

  // === 状态管理 ===
  @Column({
    type: 'enum',
    enum: ArticleStatus,
    default: ArticleStatus.DRAFT,
    comment: '文章状态',
  })
  status: ArticleStatus;

  // 目前规定浏览数和点赞数和评论数之和超过200，则推荐；也可主动设置推荐，如果主动设置则以主动设置为准
  @Column({ default: false, comment: '是否主动推荐' })
  isRecommend: boolean;

  @Column({ default: false, comment: '是否推荐' })
  isFeatured: boolean;

  @Column({ default: true, comment: '是否允许评论' })
  allowComments: boolean;

  // === 统计数据 ===
  @Column({ default: 0, comment: '浏览次数' })
  viewCount: number;

  @Column({ default: 0, comment: '点赞数' })
  likeCount: number;

  @Column({ default: 0, comment: '评论数' })
  commentCount: number;

  // 按照一分钟250字计算
  @Column({ default: 0, comment: '预计阅读时间(分钟)' })
  readingTime: number;

  // === SEO 优化 ===
  // @Column({ type: 'text', nullable: true, comment: 'SEO关键词' })
  // keywords?: string;

  // @Column({ type: 'text', nullable: true, comment: 'SEO描述' })
  // description?: string;

  // === 时间字段 ===
  @CreateDateColumn({ type: 'datetime', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', nullable: true, comment: '更新时间' })
  updatedAt?: Date;

  @Column({
    type: 'datetime',
    nullable: true,
    comment: '发布时间 (首次发布的时间)',
  })
  publishedAt?: Date;

  // === 其他功能 ===
  @Column({ default: 0, comment: '版本号 (用于内容版本控制)' })
  version: number;

  @Column({ type: 'text', nullable: true, comment: '外部链接' })
  externalUrl?: string;

  /**
   * 实用方法：检查文章是否已发布
   */
  get isPublished(): boolean {
    return this.status === ArticleStatus.PUBLISHED;
  }
}
