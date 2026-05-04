import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { comments } from 'src/db/schema';

@Injectable()
export class CommentsService {

  constructor(
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const [comment] = await this.db
      .insert(comments)
      .values(createCommentDto)
      .returning();
    return comment;
  }

  async findAll() {
    return this.db.select({
      id: comments.id,
      body: comments.body,
      creatorId: comments.creatorId,
      postId: comments.postId,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt
    }).from(comments);
  }

  async findOne(id: number) {
    const [comment] = await this.db
      .select({
        id: comments.id,
        body: comments.body,
        creatorId: comments.creatorId,
        postId: comments.postId,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt
      })
      .from(comments)
      .where(eq(comments.id, id));

    if (!comment) throw new NotFoundException(`Comment #${id} not found`);
    return comment;
  }
  
  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const [space] = await this.db
      .update(comments)
      .set({ ...updateCommentDto, updatedAt: new Date() })
      .where(eq(comments.id, id))
      .returning();

    if (!space) throw new NotFoundException(`Comment #${id} not found`);
    return space;
  }

  async remove(id: number) {
    const [comment] = await this.db
      .delete(comments)
      .where(eq(comments.id, id))
      .returning();

    if (!comment) throw new NotFoundException(`Comment #${id} not found`);
    return comment;
  }
}
