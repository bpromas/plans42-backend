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

@Module({
  imports: [DbModule, UsersModule, SpacesModule, PostsModule, CommentsModule],
  controllers: [AppController, UsersController, SpacesController, PostsController, CommentsController],
  providers: [AppService, UsersService, SpacesService, PostsService, CommentsService],
})
export class AppModule {}
