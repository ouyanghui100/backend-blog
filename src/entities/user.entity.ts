import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 用户实体
 * 用于测试数据库连接和基本 CRUD 操作
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true, comment: '用户名' })
  username: string;

  @Column({ length: 100, unique: true, comment: '邮箱地址' })
  email: string;

  @Column({ length: 255, comment: '密码哈希' })
  password: string;

  @Column({ length: 50, nullable: true, comment: '昵称' })
  nickname?: string;

  @Column({ type: 'text', nullable: true, comment: '用户头像URL' })
  avatar?: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'banned'],
    default: 'active',
    comment: '用户状态',
  })
  status: 'active' | 'inactive' | 'banned';

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
