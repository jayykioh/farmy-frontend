import { Controller, Get, Post, Body, Query, Headers } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('track')
  async trackEvent(@Body() data: any, @Headers('x-user-id') userId: string) {
    return this.eventsService.track({
      userId: userId || data.userId,
      eventType: data.eventType,
      payload: data.payload,
      sessionId: data.sessionId,
      platform: data.platform,
    });
  }

  @Get()
  async getEvents(@Query('userId') userId: string) {
    return this.eventsService.findByUser(userId);
  }
}
