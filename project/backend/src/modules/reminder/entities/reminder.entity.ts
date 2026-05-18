import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User, NotificationPref } from '../../users/entities/user.entity';

export enum ReminderType {
  DIARY = 'diary',
  WATER = 'water',
  FERTILIZE = 'fertilize',
  WEEKLY_INSIGHT = 'weekly_insight',
  STREAK_MILESTONE = 'streak_milestone',
  PLANT_ALERT = 'plant_alert',
}

export enum ReminderStatus {
  PENDING = 'pending',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('reminders')
@Index(['userId', 'scheduledAt'])
@Index(['status', 'scheduledAt'])
export class Reminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ReminderType,
  })
  type: ReminderType;

  @Column({
    type: 'enum',
    enum: NotificationPref,
    nullable: true,
  })
  channel: NotificationPref;

  @Column({ name: 'scheduled_at', type: 'timestamptz' })
  scheduledAt: Date;

  @Column({ name: 'delivered_at', type: 'timestamptz', nullable: true })
  deliveredAt: Date;

  @Column({ name: 'zns_message_id', nullable: true })
  znsMessageId: string;

  @Column({
    type: 'enum',
    enum: ReminderStatus,
    default: ReminderStatus.PENDING,
  })
  status: ReminderStatus;

  @Column({ name: 'retry_count', default: 0 })
  retryCount: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
