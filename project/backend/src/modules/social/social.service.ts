import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Follow } from './entities/follow.entity';
import { Reaction } from './entities/reaction.entity';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(Reaction)
    private readonly reactionRepository: Repository<Reaction>,
  ) {}

  async createPost(userId: string, data: Partial<Post>): Promise<Post> {
    const post = this.postRepository.create({ ...data, userId });
    return this.postRepository.save(post);
  }

  async getPosts(userId?: string): Promise<Post[]> {
    if (userId) {
      return this.postRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
    }
    return this.postRepository.find({ order: { createdAt: 'DESC' } });
  }

  async addComment(userId: string, postId: string, content: string): Promise<Comment> {
    const comment = this.commentRepository.create({ userId, postId, content });
    return this.commentRepository.save(comment);
  }

  async addReaction(userId: string, postId: string, type: string): Promise<Reaction> {
    let reaction = await this.reactionRepository.findOne({ where: { userId, postId } });
    if (reaction) {
      reaction.type = type;
    } else {
      reaction = this.reactionRepository.create({ userId, postId, type });
    }
    return this.reactionRepository.save(reaction);
  }
}
