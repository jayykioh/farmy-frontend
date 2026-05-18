import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemoryEmbedding } from './entities/memory-embedding.entity';

@Injectable()
export class EmbeddingService {
  constructor(
    @InjectRepository(MemoryEmbedding)
    private readonly memoryEmbeddingRepository: Repository<MemoryEmbedding>,
  ) {}

  async saveEmbedding(data: Partial<MemoryEmbedding>): Promise<MemoryEmbedding> {
    const memory = this.memoryEmbeddingRepository.create(data);
    return this.memoryEmbeddingRepository.save(memory);
  }

  async findBySource(sourceId: string, sourceType: string): Promise<MemoryEmbedding[]> {
    return this.memoryEmbeddingRepository.find({
      where: { sourceId, sourceType },
    });
  }
}
