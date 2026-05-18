import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async submitFeedback(@Body() data: any) {
    return this.feedbackService.create(data);
  }

  @Get()
  async getFeedback(@Query('userId') userId: string) {
    return this.feedbackService.findByUser(userId);
  }
}
