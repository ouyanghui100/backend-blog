import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { User } from './user.entity';

/**
 * 评论状态枚举
 */
export enum CommentStatus {
  PENDING = 'pending', // 待审核
  APPROVED = 'approved', // 已通过
  REJECTED = 'rejected', // 已拒绝
  SPAM = 'spam', // 垃圾评论
}

/**
 * 评论实体
 * 支持文章评论和回复功能
 */
@Entity('comments')
@Index(['articleId', 'status']) // 按文章和状态查询优化
@Index(['userId']) // 按用户查询优化
@Index(['parentId']) // 按父评论查询优化
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  // === 评论内容 ===
  @Column({ type: 'text', comment: '评论内容' })
  content: string;

  // === 关联文章 ===
  @Column({ comment: '文章ID' })
  articleId: number;

  @ManyToOne(() => Article, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'articleId' })
  article: Article;

  // === 关联用户 ===
  @Column({ comment: '用户ID' })
  userId: number;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  // === 游客评论信息（用于非注册用户） ===
  @Column({ length: 50, nullable: true, comment: '游客昵称' })
  guestName?: string;

  @Column({ length: 100, nullable: true, comment: '游客邮箱' })
  guestEmail?: string;

  @Column({ type: 'text', nullable: true, comment: '游客网站' })
  guestWebsite?: string;

  // === 评论状态 ===
  @Column({
    type: 'enum',
    enum: CommentStatus,
    default: CommentStatus.PENDING,
    comment: '评论状态',
  })
  status: CommentStatus;

  // === 层级回复 ===
  @Column({ nullable: true, comment: '父评论ID（用于回复）' })
  parentId?: number;

  @ManyToOne(() => Comment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent?: Comment;

  // === 审核信息 ===
  @Column({ type: 'datetime', nullable: true, comment: '审核时间' })
  reviewedAt?: Date;

  @Column({ type: 'text', nullable: true, comment: '审核备注' })
  reviewNote?: string;

  // === 统计信息 ===
  @Column({ default: 0, comment: '回复数量' })
  replyCount: number;

  // === 时间字段 ===
  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  /**
   * 实用方法：检查是否为游客评论
   */
  get isGuestComment(): boolean {
    return !this.userId && !!this.guestName;
  }

  /**
   * 实用方法：检查是否为回复
   */
  get isReply(): boolean {
    return !!this.parentId;
  }

  /**
   * 实用方法：检查是否已通过审核
   */
  get isApproved(): boolean {
    return this.status === CommentStatus.APPROVED;
  }

  /**
   * 实用方法：获取评论者显示名称
   */
  get commenterName(): string {
    if (this.user) {
      return this.user.displayName;
    }
    return this.guestName || '匿名用户';
  }

  /**
   * 实用方法：获取评论者邮箱
   */
  get commenterEmail(): string {
    // User实体暂不包含邮箱，优先使用游客邮箱
    return this.guestEmail || '';
  }

  /**
   * 实用方法：获取评论者网站
   */
  get commenterWebsite(): string {
    // User实体暂不包含网站，优先使用游客网站
    return this.guestWebsite || '';
  }
}
