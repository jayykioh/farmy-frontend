import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';

@Controller('embedding')
export class EmbeddingController {
  constructor(private readonly embeddingService: EmbeddingService) {}

  @Post()
  async save(@Body() data: any) {
    return this.embeddingService.saveEmbedding(data);
  }

  @Get()
  async get(@Query('sourceId') sourceId: string, @Query('sourceType') sourceType: string) {
    return this.embeddingService.findBySource(sourceId, sourceType);
  }
}
