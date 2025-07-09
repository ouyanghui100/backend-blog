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
  ADMIN = 'admin', // 后台超级管理员 - 可以编辑管理
  TOURIST = 'tourist', // 后台游客 - 只能访问查看
  COMMENTER = 'commenter', // 博客评论用户 - 可以参与评论
}

/**
 * 用户类型枚举
 */
export enum UserType {
  BACKEND = 'backend', // 后台用户（管理员和游客）
  FRONTEND = 'frontend', // 前台用户（评论用户）
}

/**
 * 用户实体
 * 支持后台管理系统和前台博客评论系统
 */
@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
@Index(['type', 'role']) // 按类型和角色查询优化
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // === 基础信息 ===
  @Column({ length: 50, unique: true, comment: '用户名' })
  username: string;

  @Column({ length: 100, unique: true, comment: '邮箱地址' })
  email: string;

  @Column({
    length: 255,
    nullable: true,
    comment: '密码哈希（评论用户可为空）',
  })
  password?: string;

  @Column({ length: 50, nullable: true, comment: '昵称/显示名称' })
  nickname?: string;

  @Column({ type: 'text', nullable: true, comment: '用户头像URL' })
  avatar?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '个人网站（主要用于评论用户）',
  })
  website?: string;

  // === 用户类型和角色 ===
  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.FRONTEND,
    comment: '用户类型（后台/前台）',
  })
  type: UserType;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.COMMENTER,
    comment: '用户角色',
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'banned'],
    default: 'active',
    comment: '用户状态',
  })
  status: 'active' | 'inactive' | 'banned';

  // === 验证和安全 ===
  @Column({ default: false, comment: '邮箱是否已验证' })
  emailVerified: boolean;

  @Column({ default: true, comment: '是否允许评论（针对评论用户）' })
  canComment: boolean;

  // === 关联文章（主要用于管理员发布的文章）===
  @OneToMany(() => Article, article => article.author)
  articles: Article[];

  // === 统计信息 ===
  @Column({ default: 0, comment: '发布的文章数量（管理员）' })
  articleCount: number;

  @Column({ default: 0, comment: '评论数量（评论用户）' })
  commentCount: number;

  // === 时间字段 ===
  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true, comment: '最后登录时间' })
  lastLoginAt?: Date;

  @Column({ type: 'datetime', nullable: true, comment: '邮箱验证时间' })
  emailVerifiedAt?: Date;

  // === 密码重置（主要用于后台用户） ===
  @Column({ type: 'text', nullable: true, comment: '密码重置令牌' })
  resetToken?: string;

  @Column({ type: 'datetime', nullable: true, comment: '密码重置令牌过期时间' })
  resetTokenExpiry?: Date;

  // === 评论用户专用字段 ===
  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
    comment: '评论用户IP地址',
  })
  ipAddress?: string;

  @Column({ type: 'text', nullable: true, comment: '用户代理信息' })
  userAgent?: string;

  @Column({ default: false, comment: '是否为可信评论用户' })
  isTrusted: boolean;

  /**
   * 实用方法：检查是否为超级管理员
   */
  get isAdmin(): boolean {
    return this.type === UserType.BACKEND && this.role === UserRole.ADMIN;
  }

  /**
   * 实用方法：检查是否为后台游客
   */
  get isTourist(): boolean {
    return this.type === UserType.BACKEND && this.role === UserRole.TOURIST;
  }

  /**
   * 实用方法：检查是否为评论用户
   */
  get isCommenter(): boolean {
    return this.type === UserType.FRONTEND && this.role === UserRole.COMMENTER;
  }

  /**
   * 实用方法：检查是否可以发布文章
   */
  get canPublish(): boolean {
    return this.isAdmin && this.status === 'active';
  }

  /**
   * 实用方法：检查是否可以访问后台
   */
  get canAccessBackend(): boolean {
    return (
      this.type === UserType.BACKEND &&
      this.status === 'active' &&
      [UserRole.ADMIN, UserRole.TOURIST].includes(this.role)
    );
  }

  /**
   * 实用方法：检查是否可以编辑后台内容
   */
  get canEdit(): boolean {
    return this.isAdmin && this.status === 'active';
  }

  /**
   * 实用方法：获取用户显示名称
   */
  get displayName(): string {
    return this.nickname || this.username;
  }

  /**
   * 实用方法：检查是否需要密码（后台用户需要，评论用户不需要）
   */
  get requiresPassword(): boolean {
    return this.type === UserType.BACKEND;
  }
}
