import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('diary_entries')
@Index(['userId', 'createdAt'])
export class DiaryEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'crop_type' })
  cropType: string;

  @Column({ name: 'growth_stage', nullable: true })
  growthStage: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column('text', { array: true, name: 'photo_urls', nullable: true })
  photoUrls: string[];

  @Column({ default: false })
  watered: boolean;

  @Column({ default: false })
  fertilized: boolean;

  @Column({ type: 'jsonb', nullable: true })
  weather: any;

  @Column({ name: 'location_text', nullable: true })
  locationText: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
