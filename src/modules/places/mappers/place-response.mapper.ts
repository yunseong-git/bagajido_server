/**
 * res 매핑용 (아래 예시)
 * Query GET /places/:id → PlaceResponseDto
 * Command POST /admin/places → PlaceResponseDto
 * Command PATCH /admin/places/:id → PlaceResponseDto
 * 
 * 추가로 prisma의 Decimal latitude, Decimal longitude를 
 * Number로 변환해서 반환함.    
 */

import { Prisma } from '@prisma/client';

import { PlaceResponseDto } from '../dto/res/place-response.dto';

type PlaceWithRelations = Prisma.PlaceGetPayload<{
  include: {
    category: true;
    externalSources: {
      select: {
        id: true;
        provider: true;
        externalId: true;
        externalType: true;
        sourceUpdatedAt: true;
        syncedAt: true;
        createdAt: true;
        updatedAt: true;
      };
    };
  };
}>;

export function toPlaceResponse(
  place: PlaceWithRelations,
): PlaceResponseDto {
  return {
    id: place.id,

    name: place.name,

    address: place.address,
    postalCode: place.postalCode,

    latitude:
      place.latitude === null
        ? null
        : Number(place.latitude),

    longitude:
      place.longitude === null
        ? null
        : Number(place.longitude),

    businessNumber: place.businessNumber,

    phone: place.phone,
    websiteUrl: place.websiteUrl,
    description: place.description,

    operationInfo: place.operationInfo,
    priceInfo: place.priceInfo,

    status: place.status,

    archivedAt: place.archivedAt,
    archiveReason: place.archiveReason,

    category: place.category
      ? {
          id: place.category.id,
          parentId: place.category.parentId,

          key: place.category.key,
          nameKo: place.category.nameKo,
          nameEn: place.category.nameEn,
        }
      : null,

    externalSources:
      place.externalSources.map((source) => ({
        id: source.id,

        provider: source.provider,
        externalId: source.externalId,
        externalType: source.externalType,

        sourceUpdatedAt: source.sourceUpdatedAt,
        syncedAt: source.syncedAt,
      })),

    createdAt: place.createdAt,
    updatedAt: place.updatedAt,
  };
}