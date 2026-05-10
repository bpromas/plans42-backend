import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { SpacesModule } from './spaces/spaces.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { SpacesController } from './spaces/spaces.controller';
import { PostsController } from './posts/posts.controller';
import { CommentsController } from './comments/comments.controller';
import { SpacesService } from './spaces/spaces.service';
import { PostsService } from './posts/posts.service';
import { CommentsService } from './comments/comments.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { OwnershipGuard } from './auth/ownership.guard';

@Module({
  imports: [DbModule, AuthModule, UsersModule, SpacesModule, PostsModule, CommentsModule],
  controllers: [AppController, UsersController, SpacesController, PostsController, CommentsController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },   // 1st: verify token
    { provide: APP_GUARD, useClass: RolesGuard },     // 2nd: check role
    { provide: APP_GUARD, useClass: OwnershipGuard }, // 3rd: check ownership
    AppService, UsersService, SpacesService, PostsService, CommentsService],
})
export class AppModule {}
