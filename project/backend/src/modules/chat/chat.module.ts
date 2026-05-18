import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiChat, AiChatSchema } from './schemas/ai-chat.schema';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AiChat.name, schema: AiChatSchema }]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
