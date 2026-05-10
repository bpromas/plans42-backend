import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';
import { users } from '../db/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const [existingUser] = await this.db
      .select({
        username: users.username
      })
      .from(users)
      .where(eq(users.username, createUserDto.username));
    if(existingUser) throw new ConflictException(`User ${createUserDto.username} already exists`)

    const [user] = await this.db
      .insert(users)
      .values({
          username: createUserDto.username,
          password: await bcrypt.hash(createUserDto.password, 10),
          role: createUserDto.role
        })
      .returning();
    return user;
  }

  async findAll() {
    return this.db.select({
      id: users.id,
      username: users.username,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    }).from(users);
  }

  async findOne(id: number) {
    const [user] = await this.db
      .select({
        id: users.id,
        username: users.username,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      })
      .from(users)
      .where(eq(users.id, id));

    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    const { password, ...rest } = updateUserDto;
    const [user] = await this.db
      .update(users)
      .set({
        ...rest,
        ...(password && { password: await bcrypt.hash(password, 10) }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }

  async remove(id: number) {
    const [user] = await this.db
      .delete(users)
      .where(eq(users.id, id))
      .returning();

    if (!user) throw new NotFoundException(`User #${id} not found`);
    return user;
  }
}