import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryEmbedding } from './entities/memory-embedding.entity';
import { EmbeddingService } from './embedding.service';
import { EmbeddingController } from './embedding.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MemoryEmbedding])],
  controllers: [EmbeddingController],
  providers: [EmbeddingService],
  exports: [EmbeddingService],
})
export class EmbeddingModule {}
