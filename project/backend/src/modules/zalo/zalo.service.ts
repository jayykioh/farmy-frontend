import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ZaloWebhook } from './entities/zalo-webhook.entity';

@Injectable()
export class ZaloService {
  constructor(
    @InjectRepository(ZaloWebhook)
    private readonly zaloWebhookRepository: Repository<ZaloWebhook>,
  ) {}

  async saveWebhook(data: Partial<ZaloWebhook>): Promise<ZaloWebhook> {
    const webhook = this.zaloWebhookRepository.create(data);
    return this.zaloWebhookRepository.save(webhook);
  }

  async markProcessed(id: string): Promise<ZaloWebhook | null> {
    const webhook = await this.zaloWebhookRepository.findOne({ where: { id } });
    if (webhook) {
      webhook.processedAt = new Date();
      return this.zaloWebhookRepository.save(webhook);
    }
    return null;
  }
}
