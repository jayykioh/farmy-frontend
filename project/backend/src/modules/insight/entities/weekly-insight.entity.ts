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

@Entity('weekly_insights')
@Index(['userId', 'weekStartDate'])
export class WeeklyInsight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'insight_text', type: 'text', nullable: true })
  insightText: string;

  @Column({ name: 'model_used', nullable: true })
  modelUsed: string;

  @Column({ name: 'tokens_used', type: 'int', nullable: true })
  tokensUsed: number;

  @Column({ name: 'delivery_status', nullable: true })
  deliveryStatus: string;

  @Column({ name: 'user_rating', type: 'smallint', nullable: true })
  userRating: number;

  @Column({ name: 'week_start_date', type: 'date' })
  weekStartDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
