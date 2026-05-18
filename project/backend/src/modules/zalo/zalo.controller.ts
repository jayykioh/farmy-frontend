import { Controller, Post, Body } from '@nestjs/common';
import { ZaloService } from './zalo.service';

@Controller('zalo')
export class ZaloController {
  constructor(private readonly zaloService: ZaloService) {}

  @Post('webhook')
  async handleWebhook(@Body() payload: any) {
    const webhook = await this.zaloService.saveWebhook({
      eventType: payload.event_name,
      payload,
    });
    // Mark as processed
    await this.zaloService.markProcessed(webhook.id);
    return { success: true };
  }
}
