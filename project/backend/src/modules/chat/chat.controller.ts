import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async addMessage(
    @Body() body: { userId: string; sessionId: string; role: string; content: string },
  ) {
    const msg = {
      role: body.role,
      content: body.content,
      timestamp: new Date(),
    };
    return this.chatService.createOrUpdateSession(body.userId, body.sessionId, msg);
  }

  @Get('session/:sessionId')
  async getSession(@Param('sessionId') sessionId: string) {
    return this.chatService.findSession(sessionId);
  }

  @Get('user')
  async getUserChats(@Query('userId') userId: string) {
    return this.chatService.findUserChats(userId);
  }
}
