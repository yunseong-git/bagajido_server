import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { VisitExperienceType, VisitVerificationType, VisitorType } from '@prisma/client';

import { PlacesQueryService } from '../../places/services/places-query.service';

import { CreateVisitDto } from '../dto/req/create-visit.dto';
import { UpdateVisitDto } from '../dto/req/update-visit.dto';
import type { VisitResponseDto } from '../dto/res/visit-response.dto';

import { toVisitResponse } from '../mappers/visit-response.mapper';

import { VisitsPrismaRepository } from '../visits.repository';
import type { UpdateVisitInput } from '../visits.repository.interface';

import { parseDateOnly } from '../utils/visit-date.util';

@Injectable()
export class VisitsCommandService {
    constructor(
        private readonly visitsRepository: VisitsPrismaRepository,
        private readonly placesQueryService: PlacesQueryService,
    ) {}

    async createVisit(
        userId: string,
        placeId: string,
        dto: CreateVisitDto,
    ): Promise<VisitResponseDto> {
        // ACTIVE / ARCHIVED와 관계없이 Bagajido Place가 존재하기만 하면
        // 과거 방문 기록 생성 가능.
        await this.placesQueryService.getPlace(placeId);

        const visit = await this.visitsRepository.create({
            userId,
            placeId,
            visitedOn: parseDateOnly(dto.visitedOn),
            visitedAt: dto.visitedAt ? new Date(dto.visitedAt) : null,
            experienceType: dto.experienceType ?? VisitExperienceType.VISIT_ONLY,
            visitorType: dto.visitorType ?? VisitorType.UNKNOWN,

            // 일반 사용자가 임의로 LOCATION / RECEIPT / ADMIN 등을 지정할 수 없음.
            verificationType: VisitVerificationType.SELF_REPORTED,
        });

        return toVisitResponse(visit);
    }

    async updateVisit(
        userId: string,
        visitId: string,
        dto: UpdateVisitDto,
    ): Promise<VisitResponseDto> {
        const existingVisit = await this.visitsRepository.findByIdAndUserId(
            visitId,
            userId,
        );

        // 굳이 visit의 존재 여부를 알려줄 필요가 없음.
        if (!existingVisit) throw new NotFoundException('VISIT_NOT_FOUND');

        const data: UpdateVisitInput = {};

        if (dto.visitedOn !== undefined) {
            data.visitedOn = parseDateOnly(dto.visitedOn);
        }

        if (dto.visitedAt !== undefined) {
            data.visitedAt = dto.visitedAt === null ? null : new Date(dto.visitedAt);
        }

        if (dto.experienceType !== undefined) {
            data.experienceType = dto.experienceType;
        }

        if (dto.visitorType !== undefined) {
            data.visitorType = dto.visitorType;
        }

        if (Object.keys(data).length === 0) throw new BadRequestException('NO_VISIT_CHANGES');

        const updatedVisit = await this.visitsRepository.updateById(visitId, data);

        return toVisitResponse(updatedVisit);
    }
}
