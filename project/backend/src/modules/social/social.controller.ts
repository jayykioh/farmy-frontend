import { Controller, Get, Post, Body, Query, Headers } from '@nestjs/common';
import { SocialService } from './social.service';

@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @Post('post')
  async createPost(@Body() data: any, @Headers('x-user-id') userId: string) {
    return this.socialService.createPost(userId || data.userId, data);
  }

  @Get('posts')
  async getPosts(@Query('userId') userId?: string) {
    return this.socialService.getPosts(userId);
  }

  @Post('comment')
  async addComment(@Body() body: { postId: string; content: string }, @Headers('x-user-id') userId: string) {
    return this.socialService.addComment(userId, body.postId, body.content);
  }

  @Post('react')
  async react(@Body() body: { postId: string; type: string }, @Headers('x-user-id') userId: string) {
    return this.socialService.addReaction(userId, body.postId, body.type);
  }
}
