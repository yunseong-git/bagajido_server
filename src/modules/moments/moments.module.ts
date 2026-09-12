import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PlacesModule } from '../places/places.module';
import { UsersModule } from '../users/users.module';
import { StorageModule } from '../storage/storage.module';

import { MomentsController } from './controllers/moments.controller';
import { PlaceMomentsController } from './controllers/place-moments.controller';
import { MomentImagesController } from './controllers/moment-images.controller';
import { MomentLikesController } from './controllers/moment-likes.controller';
import { MomentCommentsController } from './controllers/moment-comments.controller';
import { MomentCommentLikesController } from './controllers/moment-comment-likes.controller';

import { MomentsPrismaRepository } from './repositories/moment/moments.repository';
import { MomentImagesPrismaRepository } from './repositories/image/moment-images.repository';
import { MomentLikesPrismaRepository } from './repositories/like/moment-likes.repository';
import { MomentCommentsPrismaRepository } from './repositories/comment/moment-comments.repository';
import { MomentCommentLikesPrismaRepository } from './repositories/comment-like/moment-comment-likes.repository';

import { MomentsCommandService } from './services/moments-command.service';
import { MomentsQueryService } from './services/moments-query.service';
import { MomentImagesService } from './services/moment-images.service';
import { MomentLikesService } from './services/moment-likes.service';
import { MomentCommentsService } from './services/moment-comments.service';
import { MomentCommentLikesService } from './services/moment-comment-like.service';

@Module({
    imports: [AuthModule, UsersModule, PlacesModule, StorageModule],
    controllers: [
        MomentsController,
        PlaceMomentsController,
        MomentImagesController,
        MomentLikesController,
        MomentCommentsController,
        MomentCommentLikesController,
    ],
    providers: [
        MomentsPrismaRepository,
        MomentImagesPrismaRepository,
        MomentLikesPrismaRepository,
        MomentCommentsPrismaRepository,
        MomentCommentLikesPrismaRepository,

        MomentsQueryService,
        MomentsCommandService,
        MomentImagesService,
        MomentLikesService,
        MomentCommentsService,
        MomentCommentLikesService,
    ],
    exports: [
        MomentsQueryService,
    ],
})
export class MomentsModule { }