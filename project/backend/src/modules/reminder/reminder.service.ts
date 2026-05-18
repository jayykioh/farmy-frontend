import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reminder } from './entities/reminder.entity';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Reminder)
    private readonly reminderRepository: Repository<Reminder>,
  ) {}

  async create(data: Partial<Reminder>): Promise<Reminder> {
    const reminder = this.reminderRepository.create(data);
    return this.reminderRepository.save(reminder);
  }

  async findPending(): Promise<Reminder[]> {
    return this.reminderRepository.find({
      where: { status: 'pending' as any },
    });
  }
}
