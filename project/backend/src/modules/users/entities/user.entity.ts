import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export enum NotificationPref {
  AUTO = 'auto',
  PUSH = 'push',
  ZALO = 'zalo',
  EMAIL = 'email',
  NONE = 'none',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ name: 'zalo_user_id', nullable: true })
  zaloUserId: string;

  @Column({ name: 'zalo_access_token_encrypted', nullable: true })
  zaloAccessTokenEncrypted: string;

  @Column({ name: 'zalo_notification_enabled', default: false })
  zaloNotificationEnabled: boolean;

  @Column({ type: 'jsonb', name: 'push_subscription', nullable: true })
  pushSubscription: any;

  @Column({
    type: 'enum',
    enum: NotificationPref,
    name: 'notification_preference',
    default: NotificationPref.AUTO,
  })
  notificationPreference: NotificationPref;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
