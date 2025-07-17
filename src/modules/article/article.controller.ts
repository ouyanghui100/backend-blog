import {
  // Body,
  Controller,
  // Delete,
  // Get,
  // NotFoundException,
  // Param,
  // ParseIntPipe,
  // Patch,
  // Post,
  // Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  // ApiBody,
  // ApiOperation,
  // ApiParam,
  // ApiQuery,
  // ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MethodGuard } from '../../auth/guards/method.guard';
// import { StatusCodes } from '../../common/constants/status-codes';
import { ArticleService } from './article.service';
// import { ApiResponseDto } from './dto';

/**
 * 分类控制器
 * 提供分类相关的 RESTful API
 * 后台访问需要JWT认证，游客只能执行GET操作
 */
@ApiTags('articles')
@Controller('articles')
@UseGuards(JwtAuthGuard, MethodGuard) // 添加JWT认证和方法权限守卫
@ApiBearerAuth() // 标记需要Bearer Token认证
@UsePipes(new ValidationPipe({ transform: true }))
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
}
