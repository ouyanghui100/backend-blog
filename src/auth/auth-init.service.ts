import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * 认证初始化服务
 * 应用启动时自动创建默认管理员用户
 */
@Injectable()
export class AuthInitService implements OnModuleInit {
  private readonly logger = new Logger(AuthInitService.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * 模块初始化时调用
   */
  async onModuleInit(): Promise<void> {
    await this.initializeAdmin();
  }

  /**
   * 初始化管理员用户
   */
  private async initializeAdmin(): Promise<void> {
    try {
      const hasAdmin = await this.authService.hasAdmin();

      if (!hasAdmin) {
        this.logger.log('未发现管理员用户，正在创建默认管理员...');

        const admin = await this.authService.createAdmin(
          'ouyanghui',
          'keep2902897795',
        );

        this.logger.log(`✅ 默认管理员创建成功:`);
        this.logger.log(`   用户名: ${admin.username}`);
        this.logger.log(`   密码: keep2902897795`);
        this.logger.log(`   角色: ${admin.role}`);
        this.logger.log(`⚠️  请及时修改默认密码！`);
      } else {
        this.logger.log('✅ 管理员用户已存在');
      }
    } catch (error) {
      this.logger.error('❌ 创建默认管理员失败:', error);
    }
  }
}
