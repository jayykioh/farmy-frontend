import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiaryEntry } from './entities/diary-entry.entity';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(DiaryEntry)
    private readonly diaryEntryRepository: Repository<DiaryEntry>,
  ) {}

  async findAllByUser(userId: string): Promise<DiaryEntry[]> {
    return this.diaryEntryRepository.find({
      where: { userId, isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  async create(userId: string, data: Partial<DiaryEntry>): Promise<DiaryEntry> {
    const entry = this.diaryEntryRepository.create({ ...data, userId });
    return this.diaryEntryRepository.save(entry);
  }
}
