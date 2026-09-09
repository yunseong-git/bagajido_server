import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PlaceStatus, Prisma } from '@prisma/client';

import { ArchivePlaceDto } from '../dto/req/archive-place.dto';
import { CreateExternalSourceDto } from '../dto/req/create-external-source.dto';
import { CreatePlaceCategoryDto } from '../dto/req/create-place-category.dto';
import { CreatePlaceDto } from '../dto/req/create-place.dto';
import { UpdatePlaceDto } from '../dto/req/update-place.dto';
import { PlaceResponseDto } from '../dto/res/place-response.dto';

import { toPlaceResponse } from '../mappers/place-response.mapper';

import { PlacesPrismaRepository } from '../places.repository';
import type { UpdatePlaceInput } from '../places.repository.interface';

import { normalizePlaceText } from '../utils/normalize-place-text';

@Injectable()
export class PlacesCommandService {
    constructor(private readonly placesRepository: PlacesPrismaRepository) {}

    async createCategory(dto: CreatePlaceCategoryDto) {
        const existingCategory = await this.placesRepository.findCategoryByKey(dto.key);

        if (existingCategory) {
            throw new ConflictException('PLACE_CATEGORY_KEY_ALREADY_EXISTS');
        }

        if (dto.parentId) await this.assertCategoryExists(dto.parentId);

        try {
            return await this.placesRepository.createCategory({
                key: dto.key,
                nameKo: dto.nameKo.trim(),
                nameEn: dto.nameEn?.trim(),
                parentId: dto.parentId,
            });
        } catch (error) {
            this.handleUniqueConstraint(error);

            throw error;
        }
    }

    async createPlace(dto: CreatePlaceDto): Promise<PlaceResponseDto> {
        if (dto.categoryId) await this.assertCategoryExists(dto.categoryId);

        const name = dto.name.trim();
        const address = dto.address?.trim();

        try {
            const place = await this.placesRepository.createPlace({
                categoryId: dto.categoryId,

                name,
                normalizedName: normalizePlaceText(name),

                address,
                normalizedAddress: address ? normalizePlaceText(address) : undefined,

                postalCode: dto.postalCode?.trim(),

                latitude: dto.latitude,
                longitude: dto.longitude,

                businessNumber: dto.businessNumber?.trim(),

                phone: dto.phone?.trim(),
                websiteUrl: dto.websiteUrl?.trim(),
                description: dto.description?.trim(),

                operationInfo: dto.operationInfo as Prisma.InputJsonValue | undefined,
                priceInfo: dto.priceInfo as Prisma.InputJsonValue | undefined,

                externalSource: dto.externalSource
                    ? {
                        provider: dto.externalSource.provider,
                        externalId: dto.externalSource.externalId.trim(),
                        externalType: dto.externalSource.externalType?.trim(),

                        sourceUpdatedAt: dto.externalSource.sourceUpdatedAt
                            ? new Date(dto.externalSource.sourceUpdatedAt)
                            : undefined,

                        rawData: dto.externalSource.rawData as
                            | Prisma.InputJsonValue
                            | undefined,
                    }
                    : undefined,
            });

            return toPlaceResponse(place);
        } catch (error) {
            this.handleUniqueConstraint(error);

            throw error;
        }
    }

    async updatePlace(id: string, dto: UpdatePlaceDto): Promise<PlaceResponseDto> {
        await this.assertPlaceExists(id);

        if (dto.categoryId !== undefined && dto.categoryId !== null) {
            await this.assertCategoryExists(dto.categoryId);
        }

        const data: UpdatePlaceInput = {};

        if (dto.categoryId !== undefined) {
            data.categoryId = dto.categoryId;
        }

        if (dto.name !== undefined) {
            const name = dto.name.trim();

            data.name = name;
            data.normalizedName = normalizePlaceText(name);
        }

        if (dto.address !== undefined) {
            if (dto.address === null) {
                data.address = null;
                data.normalizedAddress = null;
            } else {
                const address = dto.address.trim();

                data.address = address;
                data.normalizedAddress = normalizePlaceText(address);
            }
        }

        if (dto.postalCode !== undefined) {
            data.postalCode = dto.postalCode === null ? null : dto.postalCode.trim();
        }

        if (dto.latitude !== undefined) {
            data.latitude = dto.latitude;
        }

        if (dto.longitude !== undefined) {
            data.longitude = dto.longitude;
        }

        if (dto.businessNumber !== undefined) {
            data.businessNumber = dto.businessNumber === null ? null : dto.businessNumber.trim();
        }

        if (dto.phone !== undefined) {
            data.phone = dto.phone === null ? null : dto.phone.trim();
        }

        if (dto.websiteUrl !== undefined) {
            data.websiteUrl = dto.websiteUrl === null ? null : dto.websiteUrl.trim();
        }

        if (dto.description !== undefined) {
            data.description = dto.description === null ? null : dto.description.trim();
        }

        if (dto.operationInfo !== undefined) {
            data.operationInfo =
                dto.operationInfo === null
                    ? Prisma.JsonNull
                    : (dto.operationInfo as Prisma.InputJsonValue);
        }

        if (dto.priceInfo !== undefined) {
            data.priceInfo =
                dto.priceInfo === null
                    ? Prisma.JsonNull
                    : (dto.priceInfo as Prisma.InputJsonValue);
        }

        const place = await this.placesRepository.updatePlace(id, data);

        return toPlaceResponse(place);
    }

    async archivePlace(id: string, dto: ArchivePlaceDto): Promise<PlaceResponseDto> {
        const place = await this.assertPlaceExists(id);

        if (place.status === PlaceStatus.ARCHIVED) {
            throw new ConflictException('PLACE_ALREADY_ARCHIVED');
        }

        const archivedPlace = await this.placesRepository.archivePlace(id, dto.reason?.trim());

        return toPlaceResponse(archivedPlace);
    }

    async restorePlace(id: string): Promise<PlaceResponseDto> {
        const place = await this.assertPlaceExists(id);

        if (place.status === PlaceStatus.ACTIVE) {
            throw new ConflictException('PLACE_ALREADY_ACTIVE');
        }

        const restoredPlace = await this.placesRepository.restorePlace(id);

        return toPlaceResponse(restoredPlace);
    }

    async addExternalSource(
        placeId: string,
        dto: CreateExternalSourceDto,
    ): Promise<PlaceResponseDto> {
        await this.assertPlaceExists(placeId);

        try {
            await this.placesRepository.createExternalSource(placeId, {
                provider: dto.provider,
                externalId: dto.externalId.trim(),
                externalType: dto.externalType?.trim(),

                sourceUpdatedAt: dto.sourceUpdatedAt ? new Date(dto.sourceUpdatedAt) : undefined,

                rawData: dto.rawData as Prisma.InputJsonValue | undefined,
            });

            const updatedPlace = await this.placesRepository.findPlaceById(placeId);

            if (!updatedPlace) throw new NotFoundException('PLACE_NOT_FOUND');

            return toPlaceResponse(updatedPlace);
        } catch (error) {
            this.handleUniqueConstraint(error);

            throw error;
        }
    }

    private async assertCategoryExists(id: string) {
        const category = await this.placesRepository.findCategoryById(id);

        if (!category) throw new NotFoundException('PLACE_CATEGORY_NOT_FOUND');

        return category;
    }

    private async assertPlaceExists(id: string) {
        const place = await this.placesRepository.findPlaceById(id);

        if (!place) throw new NotFoundException('PLACE_NOT_FOUND');

        return place;
    }

    private handleUniqueConstraint(error: unknown): void {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') {
            return;
        }

        const target = JSON.stringify(error.meta?.target ?? '');

        if (target.includes('provider') || target.includes('externalId')) {
            throw new ConflictException('PLACE_EXTERNAL_SOURCE_ALREADY_EXISTS');
        }

        if (target.includes('key')) {
            throw new ConflictException('PLACE_CATEGORY_KEY_ALREADY_EXISTS');
        }

        throw new ConflictException('PLACE_UNIQUE_CONSTRAINT');
    }
}
