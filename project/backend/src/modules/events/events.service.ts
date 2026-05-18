import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEvent } from './schemas/user-event.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(UserEvent.name)
    private readonly userEventModel: Model<UserEvent>,
  ) {}

  async track(data: Partial<UserEvent>): Promise<UserEvent> {
    const event = new this.userEventModel(data);
    return event.save();
  }

  async findByUser(userId: string): Promise<UserEvent[]> {
    return this.userEventModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }
}
