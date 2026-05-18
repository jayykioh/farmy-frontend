import { Controller, Get, Post, Body, Query, Headers } from '@nestjs/common';
import { DiaryService } from './diary.service';

@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get()
  async getDiaries(@Query('userId') userId: string) {
    return this.diaryService.findAllByUser(userId);
  }

  @Post()
  async createDiary(@Body() data: any, @Headers('x-user-id') userId: string) {
    return this.diaryService.create(userId || data.userId, data);
  }
}
