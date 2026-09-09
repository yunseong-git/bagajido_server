import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { GetMyVisitsDto } from '../dto/req/get-my-visits.dto';
import type { VisitListResponseDto, VisitResponseDto } from '../dto/res/visit-response.dto';

import { toVisitResponse } from '../mappers/visit-response.mapper';

import { VisitsPrismaRepository } from '../visits.repository';

import { parseDateOnly } from '../utils/visit-date.util';

@Injectable()
export class VisitsQueryService {
    constructor(private readonly visitsRepository: VisitsPrismaRepository) {}

    async getMyVisits(userId: string, dto: GetMyVisitsDto): Promise<VisitListResponseDto> {
        this.validateDateRange(dto.from, dto.to);

        const page = dto.page ?? 1;
        const limit = dto.limit ?? 20;

        const result = await this.visitsRepository.findManyByUserId({
            userId,
            placeId: dto.placeId,
            from: dto.from ? parseDateOnly(dto.from) : undefined,
            to: dto.to ? parseDateOnly(dto.to) : undefined,
            page,
            limit,
        });

        return {
            items: result.items.map(toVisitResponse),
            total: result.total,
            page,
            limit,
        };
    }

    async getMyVisit(userId: string, visitId: string): Promise<VisitResponseDto> {
        const visit = await this.visitsRepository.findByIdAndUserId(
            visitId,
            userId,
        );

        if (!visit) throw new NotFoundException('VISIT_NOT_FOUND');

        return toVisitResponse(visit);
    }

    private validateDateRange(from?: string, to?: string): void {
        if (from && to && from > to) throw new BadRequestException('INVALID_VISIT_DATE_RANGE');
    }
}
