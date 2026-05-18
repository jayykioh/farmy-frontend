import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AiFeedback } from './entities/ai-feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(AiFeedback)
    private readonly aiFeedbackRepository: Repository<AiFeedback>,
  ) {}

  async create(data: Partial<AiFeedback>): Promise<AiFeedback> {
    const feedback = this.aiFeedbackRepository.create(data);
    return this.aiFeedbackRepository.save(feedback);
  }

  async findByUser(userId: string): Promise<AiFeedback[]> {
    return this.aiFeedbackRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
