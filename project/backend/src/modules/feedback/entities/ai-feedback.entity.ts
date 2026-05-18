import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('ai_feedback')
export class AiFeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'mongo_chat_id', length: 24, nullable: true })
  mongoChatId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'smallint', nullable: true })
  rating: number;

  @Column({ type: 'boolean', nullable: true })
  helpful: boolean;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ name: 'model_used', nullable: true })
  modelUsed: string;

  @Column({ name: 'prompt_version', length: 20, nullable: true })
  promptVersion: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
