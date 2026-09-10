import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import {
    MomentExperienceType,
    MomentVerificationType,
    MomentVisibility,
    VisitorType,
} from '@prisma/client';

import { PlacesQueryService } from '../../places/services/places-query.service';

import type { CreateMomentDto } from '../dto/req/create-moment.dto';
import type { UpdateMomentDto } from '../dto/req/update-moment.dto';
import type { MomentResponseDto } from '../dto/res/moment-response.dto';

import { toMomentResponse } from '../mappers/moment-response.mapper';

import { MomentsPrismaRepository } from '../moments.repository';
import type { UpdateMomentInput } from '../moments.repository.interface';

import { parseDateOnly } from '../utils/moment-date.util';

@Injectable()
export class MomentsCommandService {
    constructor(
        private readonly momentsRepository: MomentsPrismaRepository,
        private readonly placesQueryService: PlacesQueryService,
    ) {}

    async createMoment(
        userId: string,
        placeId: string,
        dto: CreateMomentDto,
    ): Promise<MomentResponseDto> {
        await this.placesQueryService.getPlace(placeId);

        const moment = await this.momentsRepository.create({
            userId,
            placeId,

            visitedOn: parseDateOnly(dto.visitedOn),
            visitedAt: dto.visitedAt ? new Date(dto.visitedAt) : null,

            experienceType: dto.experienceType ?? MomentExperienceType.VISIT_ONLY,
            visitorType: dto.visitorType ?? VisitorType.UNKNOWN,
            verificationType: MomentVerificationType.SELF_REPORTED,

            content: dto.content?.trim() || null,
            languageCode: dto.languageCode?.trim() || null,

            visibility: dto.visibility ?? MomentVisibility.PRIVATE,
        });

        return toMomentResponse(moment);
    }

    async updateMoment(
        userId: string,
        momentId: string,
        dto: UpdateMomentDto,
    ): Promise<MomentResponseDto> {
        const existingMoment = await this.momentsRepository.findByIdAndUserId(
            momentId,
            userId,
        );

        if (!existingMoment) throw new NotFoundException('MOMENT_NOT_FOUND');

        const data: UpdateMomentInput = {};

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

        if (dto.content !== undefined) {
            data.content = dto.content === null ? null : dto.content.trim() || null;
        }

        if (dto.languageCode !== undefined) {
            data.languageCode =
                dto.languageCode === null ? null : dto.languageCode.trim() || null;
        }

        if (dto.visibility !== undefined) {
            data.visibility = dto.visibility;
        }

        if (Object.keys(data).length === 0) {
            throw new BadRequestException('NO_MOMENT_CHANGES');
        }

        const updatedMoment = await this.momentsRepository.updateById(
            momentId,
            data,
        );

        return toMomentResponse(updatedMoment);
    }

    async deleteMoment(userId: string, momentId: string): Promise<void> {
        const existingMoment = await this.momentsRepository.findByIdAndUserId(
            momentId,
            userId,
        );

        if (!existingMoment) throw new NotFoundException('MOMENT_NOT_FOUND');

        await this.momentsRepository.softDeleteById(momentId);
    }
}