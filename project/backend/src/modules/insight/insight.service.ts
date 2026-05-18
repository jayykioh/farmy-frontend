import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeeklyInsight } from './entities/weekly-insight.entity';

@Injectable()
export class InsightService {
  constructor(
    @InjectRepository(WeeklyInsight)
    private readonly weeklyInsightRepository: Repository<WeeklyInsight>,
  ) {}

  async create(data: Partial<WeeklyInsight>): Promise<WeeklyInsight> {
    const insight = this.weeklyInsightRepository.create(data);
    return this.weeklyInsightRepository.save(insight);
  }

  async findByUser(userId: string): Promise<WeeklyInsight[]> {
    return this.weeklyInsightRepository.find({
      where: { userId },
      order: { weekStartDate: 'DESC' },
    });
  }
}
