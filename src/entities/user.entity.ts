import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * 用户角色枚举
 */
export enum UserRole {
  ADMIN = 'admin', // 管理员：可以执行所有操作
  GUEST = 'guest', // 游客：只能执行GET操作
}

/**
 * 用户实体
 * 用于认证和权限管理
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50, comment: '用户名' })
  username: string;

  @Column({ length: 255, comment: '密码（加密存储）', nullable: true })
  password?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
    comment: '用户角色',
  })
  role: UserRole;

  @Column({ default: true, comment: '是否激活' })
  isActive: boolean;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @Column({
    type: 'datetime',
    nullable: true,
    comment: '最后登录时间',
  })
  lastLoginAt?: Date;

  // === 文章关联 ===
  @OneToMany('Article', 'author')
  articles: import('./article.entity').Article[];

  /**
   * 检查是否为管理员
   */
  get isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  /**
   * 检查是否为游客
   */
  get isGuest(): boolean {
    return this.role === UserRole.GUEST;
  }

  /**
   * 获取显示名称（兼容性方法）
   */
  get displayName(): string {
    return this.username;
  }
}
