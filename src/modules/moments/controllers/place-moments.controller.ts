import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUserEntity } from '../../users/decorators/current-user.decorator';
import type { CurrentUser } from '../../users/types/current-user.type';
import { RegisteredUserGuard } from '../../users/guards/registered-user.guard';

import { CreateMomentDto } from '../dto/moment/req/create-moment.dto';
import { GetPlaceMomentsDto } from '../dto/moment/req/get-place-moments.dto';

import type { MomentResponseDto } from '../dto/moment/res/moment-response.dto';
import type { PublicMomentListResponseDto } from '../dto/moment/res/public-moment-list-response.dto';

import { MomentsCommandService } from '../services/moments-command.service';
import { MomentsQueryService } from '../services/moments-query.service';

@ApiTags('Moments')
@Controller('places/:placeId/moments')
export class PlaceMomentsController {
    constructor(
        private readonly momentsQueryService: MomentsQueryService,
        private readonly momentsCommandService: MomentsCommandService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Place 공개 Moment 목록 조회' })
    getPublicPlaceMoments(
        @Param('placeId', new ParseUUIDPipe()) placeId: string,
        @Query() dto: GetPlaceMomentsDto,
    ): Promise<PublicMomentListResponseDto> {
        return this.momentsQueryService.getPublicPlaceMoments(placeId, dto);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(RegisteredUserGuard)
    @ApiOperation({ summary: 'Place에 Moment 작성' })
    createMoment(
        @CurrentUserEntity() user: CurrentUser,
        @Param('placeId', new ParseUUIDPipe()) placeId: string,
        @Body() dto: CreateMomentDto,
    ): Promise<MomentResponseDto> {
        return this.momentsCommandService.createMoment(user.id, placeId, dto);
    }
}