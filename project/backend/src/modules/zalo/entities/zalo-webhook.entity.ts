import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('zalo_webhooks')
export class ZaloWebhook {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'event_type', nullable: true })
  eventType: string;

  @Column({ type: 'jsonb', nullable: true })
  payload: any;

  @Column({ name: 'processed_at', type: 'timestamptz', nullable: true })
  processedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
