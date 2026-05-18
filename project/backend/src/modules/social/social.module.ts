import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Follow } from './entities/follow.entity';
import { Reaction } from './entities/reaction.entity';
import { SocialService } from './social.service';
import { SocialController } from './social.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment, Follow, Reaction]),
  ],
  controllers: [SocialController],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}
