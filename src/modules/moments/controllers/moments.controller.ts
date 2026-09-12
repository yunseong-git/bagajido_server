import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUserEntity } from '../../users/decorators/current-user.decorator';
import type { CurrentUser } from '../../users/types/current-user.type';
import { RegisteredUserGuard } from '../../users/guards/registered-user.guard';
import type { CurrentUser as CurrentUserType } from '../../users/types/current-user.type';

import { GetMyMomentsDto } from '../dto/moment/req/get-my-moments.dto';
import { UpdateMomentDto } from '../dto/moment/req/update-moment.dto';

import type { MomentListResponseDto } from '../dto/moment/res/moment-list-response.dto';
import type { MomentResponseDto } from '../dto/moment/res/moment-response.dto';

import { MomentsCommandService } from '../services/moments-command.service';
import { MomentsQueryService } from '../services/moments-query.service';

@ApiTags('Moments')
@ApiBearerAuth()
@UseGuards(RegisteredUserGuard)
@Controller('moments')
export class MomentsController {
    constructor(
        private readonly momentsQueryService: MomentsQueryService,
        private readonly momentsCommandService: MomentsCommandService,
    ) { }

    @Get()
    @ApiOperation({ summary: '내 Moment 목록 조회' })
    getMyMoments(
        @CurrentUserEntity() user: CurrentUser,
        @Query() dto: GetMyMomentsDto,
    ): Promise<MomentListResponseDto> {
        return this.momentsQueryService.getMyMoments(user.id, dto);
    }

    @Get(':momentId')
    @ApiOperation({ summary: '내 Moment 상세 조회' })
    getMyMoment(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
    ): Promise<MomentResponseDto> {
        return this.momentsQueryService.getMyMoment(user.id, momentId);
    }

    @Patch(':momentId')
    @ApiOperation({ summary: '내 Moment 수정' })
    updateMoment(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
        @Body() dto: UpdateMomentDto,
    ): Promise<MomentResponseDto> {
        return this.momentsCommandService.updateMoment(user.id, momentId, dto);
    }

    @Delete(':momentId')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: '내 Moment 삭제',
        description: '실제 row를 삭제하지 않고 soft delete 처리합니다.',
    })
    async deleteMoment(
        @CurrentUserEntity() user: CurrentUser,
        @Param('momentId', new ParseUUIDPipe()) momentId: string,
    ): Promise<void> {
        await this.momentsCommandService.deleteMoment(user.id, momentId);
    }
}