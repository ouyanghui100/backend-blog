import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../../common/dto/base-response.dto';
// import { Article } from '../../../entities/article.entity';

/**
 * 分类响应 DTO
 */
export class ArticleResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: '文章ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '文章标题',
    example: '文章标题',
  })
  title: string;

  @ApiProperty({
    description: '文章摘要',
    example: '文章摘要',
  })
  summary: string;

  @ApiProperty({
    description: '文章内容',
    example: '文章内容',
  })
  content: string;

  @ApiProperty({
    description: '文章作者',
    example: '文章作者',
  })
  author: string;

  @ApiProperty({
    description: '文章分类',
    example: '文章分类',
  })
  category: string;

  @ApiProperty({
    description: '文章标签',
    example: '文章标签',
  })
  tags: string[];

  @ApiProperty({
    description: '文章状态',
    example: '文章状态',
  })
  status: string;

  // constructor(article: Article) {
  //   super();
  //   this.id = article.id;
  //   this.title = article.title;
  //   this.summary = article.summary || '';
  //   this.formatBaseTimeFields(article);
  // }
}
