import { Controller, Post, Body, Get } from '@nestjs/common';
import { ReminderService } from './reminder.service';

@Controller('reminder')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Post()
  async createReminder(@Body() data: any) {
    return this.reminderService.create(data);
  }

  @Get('pending')
  async getPending() {
    return this.reminderService.findPending();
  }
}
