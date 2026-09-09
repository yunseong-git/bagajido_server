import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUserEntity } from '../../users/decorators/current-user.decorator';
import { RegisteredUserGuard } from '../../users/guards/registered-user.guard';
import type { CurrentUser } from '../../users/types/current-user.type';

import { GetMyVisitsDto } from '../dto/req/get-my-visits.dto';
import { UpdateVisitDto } from '../dto/req/update-visit.dto';
import { VisitResponseDto } from '../dto/res/visit-response.dto';

import { VisitsCommandService } from '../services/visits-command.service';
import { VisitsQueryService } from '../services/visits-query.service';

@ApiTags('visits')
@ApiBearerAuth('access-token')
@UseGuards(RegisteredUserGuard)
@Controller('visits')
export class VisitsController {
    constructor(
        private readonly visitsQueryService: VisitsQueryService,
        private readonly visitsCommandService: VisitsCommandService,
    ) {}

    @Get()
    @ApiOperation({ summary: '내 방문 기록 목록' })
    getMyVisits(@CurrentUserEntity() user: CurrentUser, @Query() dto: GetMyVisitsDto) {
        return this.visitsQueryService.getMyVisits(user.id, dto);
    }

    @Get(':visitId')
    @ApiOperation({ summary: '내 방문 기록 상세' })
    @ApiOkResponse({ type: VisitResponseDto })
    getMyVisit(
        @CurrentUserEntity() user: CurrentUser,
        @Param('visitId', new ParseUUIDPipe()) visitId: string,
    ) {
        return this.visitsQueryService.getMyVisit(user.id, visitId);
    }

    @Patch(':visitId')
    @ApiOperation({ summary: '내 방문 기록 수정' })
    @ApiOkResponse({ type: VisitResponseDto })
    updateVisit(
        @CurrentUserEntity() user: CurrentUser,
        @Param('visitId', new ParseUUIDPipe()) visitId: string,
        @Body() dto: UpdateVisitDto,
    ) {
        return this.visitsCommandService.updateVisit(user.id, visitId, dto);
    }
}
