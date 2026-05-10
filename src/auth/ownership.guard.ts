import {
  Injectable, CanActivate, ExecutionContext,
  ForbiddenException, NotFoundException, Inject,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';
import { spaces, posts, comments } from '../db/schema';

export const OWNERSHIP_RESOURCE = 'ownershipResource';
export const CheckOwnership = (resource: 'space' | 'post' | 'comment') =>
  SetMetadata(OWNERSHIP_RESOURCE, resource);

const resourceMap = {
  space: spaces,
  post: posts,
  comment: comments,
};

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('DB') private db: NodePgDatabase<typeof schema>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const resource = this.reflector.getAllAndOverride<string>(OWNERSHIP_RESOURCE, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!resource) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const id = parseInt(req.params.id, 10);

    // Admins bypass ownership check
    if (user.role === 'admin') return true;

    const table = resourceMap[resource];
    const [record] = await this.db
      .select({ creatorId: table.creatorId })
      .from(table as any)
      .where(eq(table.id as any, id));

    if (!record) throw new NotFoundException(`${resource} #${id} not found`);
    if (record.creatorId !== user.id) {
      throw new ForbiddenException(`You do not own this ${resource}`);
    }
    return true;
  }
}