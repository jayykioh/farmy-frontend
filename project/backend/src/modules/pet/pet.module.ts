import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetState } from './entities/pet-state.entity';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PetState])],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService],
})
export class PetModule {}
