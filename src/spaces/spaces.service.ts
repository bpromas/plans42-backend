import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { spaces } from 'src/db/schema';

@Injectable()
export class SpacesService {

  constructor(
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createSpaceDto: CreateSpaceDto) {
    const [space] = await this.db
      .insert(spaces)
      .values(createSpaceDto)
      .returning();
    return space;
  }

  async findAll() {
    return this.db.select({
      id: spaces.id,
      name: spaces.name,
      creatorId: spaces.creatorId,
      guestId: spaces.guestId,
      createdAt: spaces.createdAt,
      updatedAt: spaces.updatedAt
    }).from(spaces);
  }

  async findOne(id: number) {
    const [space] = await this.db
      .select({
        id: spaces.id,
        name: spaces.name,
        creatorId: spaces.creatorId,
        guestId: spaces.guestId,
        createdAt: spaces.createdAt,
        updatedAt: spaces.updatedAt
      })
      .from(spaces)
      .where(eq(spaces.id, id));

    if (!space) throw new NotFoundException(`Space #${id} not found`);
    return space;
  }
  
  async update(id: number, updateSpaceDto: UpdateSpaceDto) {
    const [space] = await this.db
      .update(spaces)
      .set({ ...updateSpaceDto, updatedAt: new Date() })
      .where(eq(spaces.id, id))
      .returning();

    if (!space) throw new NotFoundException(`Space #${id} not found`);
    return space;
  }

  async remove(id: number) {
    const [space] = await this.db
      .delete(spaces)
      .where(eq(spaces.id, id))
      .returning();

    if (!space) throw new NotFoundException(`Space #${id} not found`);
    return space;
  }
}
