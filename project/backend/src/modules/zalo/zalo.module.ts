import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZaloWebhook } from './entities/zalo-webhook.entity';
import { ZaloService } from './zalo.service';
import { ZaloController } from './zalo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ZaloWebhook])],
  controllers: [ZaloController],
  providers: [ZaloService],
  exports: [ZaloService],
})
export class ZaloModule {}
