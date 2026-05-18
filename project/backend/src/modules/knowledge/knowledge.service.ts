import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KnowledgeDoc } from './entities/knowledge-doc.entity';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectRepository(KnowledgeDoc)
    private readonly knowledgeDocRepository: Repository<KnowledgeDoc>,
  ) {}

  async create(data: Partial<KnowledgeDoc>): Promise<KnowledgeDoc> {
    const doc = this.knowledgeDocRepository.create(data);
    return this.knowledgeDocRepository.save(doc);
  }

  async searchByCategory(category: string): Promise<KnowledgeDoc[]> {
    return this.knowledgeDocRepository.find({
      where: { category },
    });
  }
}
