import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'user_events',
  timestamps: { createdAt: true, updatedAt: false },
})
export class UserEvent extends Document {
  @Prop({ required: true })
  userId: string; // UUID string

  @Prop({ required: true })
  eventType: string; // e.g. 'diary_created' | 'chat_sent' | 'scan_done' | 'feed_scroll'

  @Prop({ type: Object, default: {} })
  payload: Record<string, any>;

  @Prop({ required: true })
  sessionId: string; // UUID string

  @Prop({ required: true, default: 'web' })
  platform: string; // 'web' | 'mobile'

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserEventSchema = SchemaFactory.createForClass(UserEvent);

// Indexes
UserEventSchema.index({ userId: 1, createdAt: -1 });
UserEventSchema.index({ eventType: 1, createdAt: -1 });
UserEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // TTL 30 days
