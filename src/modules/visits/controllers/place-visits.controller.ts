import { Body, Controller, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentUserEntity } from '../../users/decorators/current-user.decorator';
import { RegisteredUserGuard } from '../../users/guards/registered-user.guard';
import type { CurrentUser } from '../../users/types/current-user.type';

import { CreateVisitDto } from '../dto/req/create-visit.dto';
import { VisitResponseDto } from '../dto/res/visit-response.dto';

import { VisitsCommandService } from '../services/visits-command.service';

@ApiTags('visits')
@ApiBearerAuth('access-token')
@UseGuards(RegisteredUserGuard)
@Controller('places/:placeId/visits')
export class PlaceVisitsController {
    constructor(private readonly visitsCommandService: VisitsCommandService) {}

    @Post()
    @ApiOperation({ summary: '장소 방문 기록 생성' })
    @ApiCreatedResponse({ type: VisitResponseDto })
    createVisit(
        @CurrentUserEntity() user: CurrentUser,
        @Param('placeId', new ParseUUIDPipe()) placeId: string,
        @Body() dto: CreateVisitDto,
    ) {
        return this.visitsCommandService.createVisit(user.id, placeId, dto);
    }
}
