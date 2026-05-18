import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class ChatMessage {
  @Prop({ required: true, enum: ['user', 'assistant'] })
  role: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 'gemini-flash' })
  model: string;

  @Prop({ type: Number })
  tokens: number;

  @Prop({ type: Number })
  latency: number; // in milliseconds

  @Prop({ name: 'prompt_version' })
  promptVersion: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

@Schema({
  collection: 'ai_chats',
  timestamps: true,
})
export class AiChat extends Document {
  @Prop({ required: true })
  userId: string; // UUID string

  @Prop({ required: true, unique: true })
  sessionId: string; // UUID string

  @Prop({ type: [ChatMessageSchema], default: [] })
  messages: ChatMessage[];

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AiChatSchema = SchemaFactory.createForClass(AiChat);

// Indexes
AiChatSchema.index({ userId: 1, createdAt: -1 });
AiChatSchema.index({ sessionId: 1 }, { unique: true });
AiChatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // TTL 90 days
