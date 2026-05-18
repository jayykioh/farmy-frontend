import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiChat } from './schemas/ai-chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(AiChat.name)
    private readonly aiChatModel: Model<AiChat>,
  ) {}

  async createOrUpdateSession(userId: string, sessionId: string, message: any): Promise<AiChat> {
    return this.aiChatModel.findOneAndUpdate(
      { sessionId },
      {
        $setOnInsert: { userId, sessionId },
        $push: { messages: message },
      },
      { upsert: true, new: true },
    ).exec();
  }

  async findSession(sessionId: string): Promise<AiChat | null> {
    return this.aiChatModel.findOne({ sessionId }).exec();
  }

  async findUserChats(userId: string): Promise<AiChat[]> {
    return this.aiChatModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }
}
