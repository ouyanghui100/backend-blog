import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../../entities/tag.entity';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TagSeedService } from './tag-seed.service';

/**
 * 标签模块
 * 管理标签相关的功能
 */
@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  controllers: [TagController],
  providers: [TagService, TagSeedService],
  exports: [TagService, TagSeedService],
})
export class TagModule {}
