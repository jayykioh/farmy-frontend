import { Controller, Get, Post, Body, Query, Headers } from '@nestjs/common';
import { PlantScanService } from './plant-scan.service';

@Controller('plant-scan')
export class PlantScanController {
  constructor(private readonly plantScanService: PlantScanService) {}

  @Post()
  async createScan(@Body() data: any, @Headers('x-user-id') userId: string) {
    return this.plantScanService.createScan({
      ...data,
      userId: userId || data.userId,
    });
  }

  @Get()
  async getScans(@Query('userId') userId: string) {
    return this.plantScanService.findByUser(userId);
  }

  @Get('phash')
  async getByPHash(@Query('pHash') pHash: string) {
    return this.plantScanService.findByPHash(pHash);
  }
}
