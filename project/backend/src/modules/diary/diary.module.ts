import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntry } from './entities/diary-entry.entity';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DiaryEntry])],
  controllers: [DiaryController],
  providers: [DiaryService],
  exports: [DiaryService],
})
export class DiaryModule {}
