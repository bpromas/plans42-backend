import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { posts, spaces, users } from 'src/db/schema';

@Injectable()
export class PostsService {

  constructor(
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    
    // Validate creatorId exists
    const [creator] = await this.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, createPostDto.creatorId));
    if (!creator) throw new NotFoundException(`User #${createPostDto.creatorId} not found`);

    // Validate spaceId exists
    const [space] = await this.db
      .select({ id: spaces.id })
      .from(spaces)
      .where(eq(spaces.id, createPostDto.spaceId));
    if (!space) throw new NotFoundException(`Space #${createPostDto.spaceId} not found`);

    const [post] = await this.db
      .insert(posts)
      .values(createPostDto)
      .returning();
    return post;
  }

  async findAll() {
    return this.db.select({
      id: posts.id,
      title: posts.title,
      body: posts.body,
      creatorId: posts.creatorId,
      spaceId: posts.spaceId,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt
    }).from(posts);
  }

  async findOne(id: number) {
    const [post] = await this.db
      .select({
        id: posts.id,
        title: posts.title,
        body: posts.body,
        creatorId: posts.creatorId,
        spaceId: posts.spaceId,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt
      })
      .from(posts)
      .where(eq(posts.id, id));

    if (!post) throw new NotFoundException(`Post #${id} not found`);
    return post;
  }
  
  async update(id: number, updatePostDto: UpdatePostDto) {
    const [space] = await this.db
      .update(posts)
      .set({ ...updatePostDto, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();

    if (!space) throw new NotFoundException(`Post #${id} not found`);
    return space;
  }

  async remove(id: number) {
    const [post] = await this.db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();

    if (!post) throw new NotFoundException(`Post #${id} not found`);
    return post;
  }
}
