import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PetState, PetMood } from './entities/pet-state.entity';

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(PetState)
    private readonly petStateRepository: Repository<PetState>,
  ) {}

  async findByUserId(userId: string): Promise<PetState | null> {
    return this.petStateRepository.findOne({ where: { userId } });
  }

  async updatePetMood(userId: string, mood: PetMood, reason?: string): Promise<PetState> {
    let petState = await this.findByUserId(userId);
    if (!petState) {
      petState = this.petStateRepository.create({ userId, mood, moodReason: reason });
    } else {
      petState.mood = mood;
      petState.moodReason = reason || petState.moodReason;
    }
    return this.petStateRepository.save(petState);
  }
}
