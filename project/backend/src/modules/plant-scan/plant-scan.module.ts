import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlantScan, PlantScanSchema } from './schemas/plant-scan.schema';
import { PlantScanService } from './plant-scan.service';
import { PlantScanController } from './plant-scan.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PlantScan.name, schema: PlantScanSchema }]),
  ],
  controllers: [PlantScanController],
  providers: [PlantScanService],
  exports: [PlantScanService],
})
export class PlantScanModule {}
