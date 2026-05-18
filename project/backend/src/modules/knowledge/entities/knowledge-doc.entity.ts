import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

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

@Entity('knowledge_docs')
export class KnowledgeDoc {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ nullable: true })
  category: string;

  @Column({ name: 'chunk_text', type: 'text' })
  chunkText: string;

  @Column({ name: 'source_model', length: 50, default: 'gemini-embedding-004' })
  sourceModel: string;

  @Column({
    type: 'varchar',
    name: 'embedding',
    nullable: false,
    transformer: vectorTransformer,
  })
  embedding: number[];

  @Column({ name: 'verified_by', nullable: true })
  verifiedById: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'verified_by' })
  verifiedBy: User;

  @Column({ name: 'quality_score', type: 'smallint', default: 5 })
  qualityScore: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
