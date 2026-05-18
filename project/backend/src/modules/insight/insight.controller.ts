import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { InsightService } from './insight.service';

@Controller('insight')
export class InsightController {
  constructor(private readonly insightService: InsightService) {}

  @Post()
  async generate(@Body() data: any) {
    return this.insightService.create(data);
  }

  @Get()
  async get(@Query('userId') userId: string) {
    return this.insightService.findByUser(userId);
  }
}
