import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import type { GetMyMomentsDto } from '../dto/req/get-my-moments.dto';
import type { GetPlaceMomentsDto } from '../dto/req/get-place-moments.dto';

import type { MomentListResponseDto } from '../dto/res/moment-list-response.dto';
import type { MomentResponseDto } from '../dto/res/moment-response.dto';
import type { PublicMomentListResponseDto } from '../dto/res/public-moment-list-response.dto';

import {
    toMomentResponse,
    toPublicMomentResponse,
} from '../mappers/moment-response.mapper';

import { MomentsPrismaRepository } from '../moments.repository';

import { parseDateOnly } from '../utils/moment-date.util';

@Injectable()
export class MomentsQueryService {
    constructor(private readonly momentsRepository: MomentsPrismaRepository) {}

    async getMyMoments(
        userId: string,
        dto: GetMyMomentsDto,
    ): Promise<MomentListResponseDto> {
        const from = dto.from ? parseDateOnly(dto.from) : undefined;
        const to = dto.to ? parseDateOnly(dto.to) : undefined;

        if (from && to && from > to) {
            throw new BadRequestException('INVALID_MOMENT_DATE_RANGE');
        }

        const result = await this.momentsRepository.findManyByUserId({
            userId,
            placeId: dto.placeId,
            from,
            to,
            skip: (dto.page - 1) * dto.limit,
            take: dto.limit,
        });

        return {
            items: result.items.map(toMomentResponse),
            page: dto.page,
            limit: dto.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / dto.limit),
        };
    }

    async getMyMoment(
        userId: string,
        momentId: string,
    ): Promise<MomentResponseDto> {
        const moment = await this.momentsRepository.findByIdAndUserId(
            momentId,
            userId,
        );

        if (!moment) throw new NotFoundException('MOMENT_NOT_FOUND');

        return toMomentResponse(moment);
    }

    async getPublicPlaceMoments(
        placeId: string,
        dto: GetPlaceMomentsDto,
    ): Promise<PublicMomentListResponseDto> {
        const result = await this.momentsRepository.findPublicByPlaceId({
            placeId,
            skip: (dto.page - 1) * dto.limit,
            take: dto.limit,
        });

        return {
            items: result.items.map(toPublicMomentResponse),
            page: dto.page,
            limit: dto.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / dto.limit),
        };
    }
}