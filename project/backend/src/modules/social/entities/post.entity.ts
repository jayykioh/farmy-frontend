import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DiaryEntry } from '../../diary/entities/diary-entry.entity';

export enum PostVisibility {
  PUBLIC = 'public',
  FOLLOWERS = 'followers',
  PRIVATE = 'private',
}

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'diary_entry_id', type: 'uuid', nullable: true })
  diaryEntryId: string;

  @ManyToOne(() => DiaryEntry, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'diary_entry_id' })
  diaryEntry: DiaryEntry;

  @Column({ type: 'text', nullable: true })
  caption: string;

  @Column('text', { array: true, name: 'photo_urls', nullable: true })
  photoUrls: string[];

  @Column({
    type: 'enum',
    enum: PostVisibility,
    default: PostVisibility.PUBLIC,
  })
  visibility: PostVisibility;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
