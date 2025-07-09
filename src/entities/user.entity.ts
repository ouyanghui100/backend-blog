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
 * 用户角色枚举
 */
export enum UserRole {
  ADMIN = 'admin', // 管理员
  TOURISTS = 'tourists', // 游客
}

/**
 * 用户实体
 * 博客系统的用户管理
 */
@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // === 基础信息 ===
  @Column({ length: 50, unique: true, comment: '用户名' })
  username: string;

  @Column({ length: 100, unique: true, comment: '邮箱地址' })
  email: string;

  @Column({ length: 255, comment: '密码哈希' })
  password: string;

  @Column({ length: 50, nullable: true, comment: '昵称/显示名称' })
  nickname?: string;

  @Column({ type: 'text', nullable: true, comment: '用户头像URL' })
  avatar?: string;

  @Column({ type: 'text', nullable: true, comment: '个人网站' })
  website?: string;

  // === 角色和权限 ===
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN,
    comment: '管理员',
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'banned'],
    default: 'active',
    comment: '用户状态',
  })
  status: 'active' | 'inactive' | 'banned';

  @Column({ default: false, comment: '邮箱是否已验证' })
  emailVerified: boolean;

  // === 博客相关设置 ===
  @Column({ default: true, comment: '是否允许发布文章' })
  canPublish: boolean;

  @Column({ default: true, comment: '是否允许评论' })
  canComment: boolean;

  @Column({ default: false, comment: '是否接收邮件通知' })
  emailNotifications: boolean;

  // === 关联文章 ===
  @OneToMany(() => Article, article => article.author)
  articles: Article[];

  // === 统计信息 ===
  @Column({ default: 0, comment: '发布的文章数量' })
  articleCount: number;

  @Column({ default: 0, comment: '文章总浏览量' })
  totalViews: number;

  @Column({ default: 0, comment: '获得的总点赞数' })
  totalLikes: number;

  // === 时间字段 ===
  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true, comment: '最后登录时间' })
  lastLoginAt?: Date;

  @Column({ type: 'datetime', nullable: true, comment: '邮箱验证时间' })
  emailVerifiedAt?: Date;

  // === 其他设置 ===
  @Column({ type: 'text', nullable: true, comment: '密码重置令牌' })
  resetToken?: string;

  @Column({ type: 'datetime', nullable: true, comment: '密码重置令牌过期时间' })
  resetTokenExpiry?: Date;

  /**
   * 实用方法：检查用户是否为管理员
   */
  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  /**
   * 实用方法：检查用户是否可以发布文章
   */
  get canWrite(): boolean {
    return (
      this.canPublish &&
      this.status === 'active' &&
      [UserRole.ADMIN].includes(this.role)
    );
  }

  /**
   * 实用方法：获取用户显示名称
   */
  get displayName(): string {
    return this.nickname || this.username;
  }
}
