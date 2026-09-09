import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceStatus } from '@prisma/client';

import { GetPlaceListDto } from '../dto/req/get-place-list.dto';
import { PlaceListResponseDto, PlaceResponseDto } from '../dto/res/place-response.dto';

import { toPlaceResponse } from '../mappers/place-response.mapper';

import { PlacesPrismaRepository } from '../places.repository';

import { normalizePlaceText } from '../utils/normalize-place-text';

@Injectable()
export class PlacesQueryService {
    constructor(private readonly placesRepository: PlacesPrismaRepository) {}

    getCategories() {
        return this.placesRepository.findCategories();
    }

    async getPlaces(dto: GetPlaceListDto): Promise<PlaceListResponseDto> {
        const page = dto.page ?? 1;
        const limit = dto.limit ?? 20;
        const status = dto.status ?? PlaceStatus.ACTIVE;

        if (dto.categoryId) await this.assertCategoryExists(dto.categoryId);

        const query = dto.query ? normalizePlaceText(dto.query) : undefined;

        const result = await this.placesRepository.findPlaces({
            query,
            categoryId: dto.categoryId,
            status,
            page,
            limit,
        });

        return {
            items: result.items.map(toPlaceResponse),
            total: result.total,
            page,
            limit,
        };
    }

    async getPlace(id: string): Promise<PlaceResponseDto> {
        const place = await this.placesRepository.findPlaceById(id);

        if (!place) throw new NotFoundException('PLACE_NOT_FOUND');

        return toPlaceResponse(place);
    }

    private async assertCategoryExists(id: string) {
        const category = await this.placesRepository.findCategoryById(id);

        if (!category) throw new NotFoundException('PLACE_CATEGORY_NOT_FOUND');

        return category;
    }
}
