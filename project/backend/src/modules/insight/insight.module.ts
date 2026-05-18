import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeeklyInsight } from './entities/weekly-insight.entity';
import { InsightService } from './insight.service';
import { InsightController } from './insight.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WeeklyInsight])],
  controllers: [InsightController],
  providers: [InsightService],
  exports: [InsightService],
})
export class InsightModule {}
