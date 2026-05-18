import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post()
  async addDoc(@Body() data: any) {
    return this.knowledgeService.create(data);
  }

  @Get()
  async getByCategory(@Query('category') category: string) {
    return this.knowledgeService.searchByCategory(category);
  }
}
