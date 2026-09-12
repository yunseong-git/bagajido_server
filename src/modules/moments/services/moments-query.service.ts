import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { R2StorageService } from '../../storage/r2/r2-storage.service';

import type { GetMyMomentsDto } from '../dto/moment/req/get-my-moments.dto';
import type { GetPlaceMomentsDto } from '../dto/moment/req/get-place-moments.dto';

import type { MomentListResponseDto } from '../dto/moment/res/moment-list-response.dto';
import type { MomentResponseDto } from '../dto/moment/res/moment-response.dto';
import type { PublicMomentListResponseDto } from '../dto/moment/res/public-moment-list-response.dto';

import { toMomentResponse, toPublicMomentResponse } from '../mappers/moment-response.mapper';

import { MomentsPrismaRepository } from '../repositories/moment/moments.repository';
import { MomentLikesPrismaRepository } from '../repositories/like/moment-likes.repository';

import type { MomentWithRelations } from '../types/moment-with-relations.type';

import { parseDateOnly } from '../utils/moment-date.util';

@Injectable()
export class MomentsQueryService {
    constructor(
        private readonly momentsRepository: MomentsPrismaRepository,
        private readonly momentLikesRepository: MomentLikesPrismaRepository,
        private readonly r2StorageService: R2StorageService,
    ) { }

    /** 내부 도메인용 */
    async getOwnedActiveMoment(
        userId: string,
        momentId: string,
    ): Promise<MomentWithRelations> {
        const moment =
            await this.momentsRepository.findByIdAndUserId(
                momentId,
                userId,
            );

        if (!moment) {
            throw new NotFoundException('MOMENT_NOT_FOUND');
        }

        return moment;
    }

    /** 내부 도메인용 */
    async getPublicActiveMoment(
        momentId: string,
    ): Promise<MomentWithRelations> {
        const moment =
            await this.momentsRepository.findPublicById(
                momentId,
            );

        if (!moment) {
            throw new NotFoundException('MOMENT_NOT_FOUND');
        }

        return moment;
    }

    async getMyMoments(
        userId: string,
        dto: GetMyMomentsDto,
    ): Promise<MomentListResponseDto> {
        const from = dto.from
            ? parseDateOnly(dto.from)
            : undefined;

        const to = dto.to
            ? parseDateOnly(dto.to)
            : undefined;

        if (from && to && from > to) {
            throw new BadRequestException(
                'INVALID_MOMENT_DATE_RANGE',
            );
        }

        const result =
            await this.momentsRepository.findManyByUserId({
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
        const moment = await this.getOwnedActiveMoment(
            userId,
            momentId,
        );

        return toMomentResponse(moment);
    }

    async getPublicPlaceMoments(
        placeId: string,
        dto: GetPlaceMomentsDto,
        userId?: string,
    ): Promise<PublicMomentListResponseDto> {
        const result =
            await this.momentsRepository.findPublicByPlaceId({
                placeId,
                skip: (dto.page - 1) * dto.limit,
                take: dto.limit,
            });

        const likedMomentIds = userId
            ? await this.momentLikesRepository.findLikedMomentIds(
                userId,
                result.items.map((moment) => moment.id),
            )
            : [];

        const likedMomentIdSet = new Set(likedMomentIds);

        return {
            items: result.items.map((moment) =>
                toPublicMomentResponse(
                    moment,
                    (objectKey) =>
                        this.r2StorageService.getPublicUrl(objectKey),
                    likedMomentIdSet.has(moment.id),
                ),
            ),
            page: dto.page,
            limit: dto.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / dto.limit),
        };
    }
}