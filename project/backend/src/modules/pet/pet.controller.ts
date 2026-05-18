import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetMood } from './entities/pet-state.entity';

@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  @Get()
  async getPet(@Query('userId') userId: string) {
    return this.petService.findByUserId(userId);
  }

  @Post('mood')
  async updateMood(@Body() body: { userId: string; mood: PetMood; reason?: string }) {
    return this.petService.updatePetMood(body.userId, body.mood, body.reason);
  }
}
