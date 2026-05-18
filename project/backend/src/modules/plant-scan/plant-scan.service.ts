import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlantScan } from './schemas/plant-scan.schema';

@Injectable()
export class PlantScanService {
  constructor(
    @InjectModel(PlantScan.name)
    private readonly plantScanModel: Model<PlantScan>,
  ) {}

  async createScan(data: Partial<PlantScan>): Promise<PlantScan> {
    const scan = new this.plantScanModel(data);
    return scan.save();
  }

  async findByUser(userId: string): Promise<PlantScan[]> {
    return this.plantScanModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async findByPHash(pHash: string): Promise<PlantScan[]> {
    return this.plantScanModel.find({ pHash }).exec();
  }
}
