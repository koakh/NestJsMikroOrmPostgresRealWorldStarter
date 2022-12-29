import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from '../user/user.decorator';
import { IArticleRO, IArticlesRO, ICommentsRO } from './article.interface';
import { ArticleService } from './article.service';
import { CreateArticleDto, CreateCommentDto } from './dto';

@ApiBearerAuth()
@ApiTags('articles')
@Controller('articles')
export class ArticleController {

  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'Return all articles.' })
  @Get()
  async findAll(@User('id') userId: string, @Query() query): Promise<IArticlesRO> {
    return this.articleService.findAll(userId, query);
  }

  @ApiOperation({ summary: 'Get article feed' })
  @ApiResponse({ status: 200, description: 'Return article feed.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('feed')
  async getFeed(@User('id') userId: string, @Query() query): Promise<IArticlesRO> {
    return this.articleService.findFeed(userId, query);
  }

  @Get(':slug')
  async findOne(@User('id') userId: string, @Param('slug') slug): Promise<IArticleRO> {
    return this.articleService.findOne(userId, { slug });
  }

  @Get(':slug/comments')
  async findComments(@Param('slug') slug): Promise<ICommentsRO> {
    return this.articleService.findComments(slug);
  }

  @ApiOperation({ summary: 'Create article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(@User('id') userId: string, @Body('article') articleData: CreateArticleDto) {
    return this.articleService.create(userId, articleData);
  }

  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put(':slug')
  async update(@User('id') userId: string, @Param() params, @Body('article') articleData: CreateArticleDto) {
    // Todo: update slug also when title gets changed
    return this.articleService.update(userId, params.slug, articleData);
  }

  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug')
  async delete(@Param() params) {
    return this.articleService.delete(params.slug);
  }

  @ApiOperation({ summary: 'Create comment' })
  @ApiResponse({ status: 201, description: 'The comment has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/comments')
  async createComment(@User('id') userId: string, @Param('slug') slug, @Body('comment') commentData: CreateCommentDto) {
    return this.articleService.addComment(userId, slug, commentData);
  }

  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 201, description: 'The article has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/comments/:id')
  async deleteComment(@User('id') userId: string, @Param() params) {
    const { slug, id: commentId } = params;
    return this.articleService.deleteComment(userId, slug, commentId);
  }

  @ApiOperation({ summary: 'Favorite article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully favorited.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post(':slug/favorite')
  async favorite(@User('id') userId: string, @Param('slug') slug) {
    return this.articleService.favorite(userId, slug);
  }

  @ApiOperation({ summary: 'Unfavorite article' })
  @ApiResponse({ status: 201, description: 'The article has been successfully unfavorited.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete(':slug/favorite')
  async unFavorite(@User('id') userId: string, @Param('slug') slug) {
    return this.articleService.unFavorite(userId, slug);
  }

}
