import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Import sub-modules
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { DiaryModule } from './modules/diary/diary.module';
import { ReminderModule } from './modules/reminder/reminder.module';
import { PetModule } from './modules/pet/pet.module';
import { AuditModule } from './modules/audit/audit.module';
import { EmbeddingModule } from './modules/embedding/embedding.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { InsightModule } from './modules/insight/insight.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { SocialModule } from './modules/social/social.module';
import { ZaloModule } from './modules/zalo/zalo.module';
import { ChatModule } from './modules/chat/chat.module';
import { EventsModule } from './modules/events/events.module';
import { PlantScanModule } from './modules/plant-scan/plant-scan.module';

@Module({
  imports: [
    // 1. Config management
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. PostgreSQL Relational Layer (TypeORM) with pooling constraints (Section 19.2)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'farmdiary'),
        autoLoadEntities: true,
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
        logging: configService.get<boolean>('DB_LOGGING', false),
        extra: {
          max: 20, // Max connection pool size (Section 19.2)
          min: 2,  // Min connection pool size (Section 19.2)
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 5000,
          statement_timeout: 10000,
        },
      }),
    }),

    // 3. MongoDB Secondary Data Layer (Mongoose) with pooling constraints (Section 19.2)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI', 'mongodb://localhost:27017/farmdiary'),
        maxPoolSize: 10, // Max pool size (Section 19.2)
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 10000,
      }),
    }),

    // 4. Redis Async Processing (BullMQ)
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),

    // 5. Register Sub-Modules
    UsersModule,
    AuthModule,
    DiaryModule,
    ReminderModule,
    PetModule,
    AuditModule,
    EmbeddingModule,
    FeedbackModule,
    InsightModule,
    KnowledgeModule,
    SocialModule,
    ZaloModule,
    ChatModule,
    EventsModule,
    PlantScanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
