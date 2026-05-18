import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum PetMood {
  HAPPY = 'happy',
  NEUTRAL = 'neutral',
  SAD = 'sad',
  WORRIED = 'worried',
  EXCITED = 'excited',
}

@Entity('pet_state')
export class PetState {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: PetMood,
    default: PetMood.NEUTRAL,
  })
  mood: PetMood;

  @Column({ name: 'streak_count', default: 0 })
  streakCount: number;

  @Column({ name: 'last_diary_at', type: 'timestamptz', nullable: true })
  lastDiaryAt: Date;

  @Column({ name: 'mood_reason', type: 'text', nullable: true })
  moodReason: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
