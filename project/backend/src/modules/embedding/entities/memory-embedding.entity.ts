import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

// Transformer to convert between Float32Array/number[] and the pgvector string representation: '[0.1,0.2,...]'
const vectorTransformer = {
  to: (value: number[] | string) => {
    if (Array.isArray(value)) {
      return `[${value.join(',')}]`;
    }
    return value;
  },
  from: (value: any) => {
    if (typeof value === 'string') {
      return value
        .replace(/[\[\]\s]/g, '')
        .split(',')
        .map(Number);
    }
    return value;
  },
};

@Entity('memory_embeddings')
@Index(['sourceId', 'sourceType'])
export class MemoryEmbedding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'source_id', type: 'uuid' })
  sourceId: string;

  @Column({ name: 'source_type' })
  sourceType: string; // 'diary_entry' | 'diary_summary'

  @Column({ name: 'source_model', length: 50, default: 'gemini-embedding-004' })
  sourceModel: string;

  @Column({
    type: 'varchar', // represented as string/varchar or custom in pg client
    name: 'embedding',
    nullable: false,
    transformer: vectorTransformer,
  })
  embedding: number[];

  @Column({ name: 'chunk_text', type: 'text', nullable: true })
  chunkText: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
