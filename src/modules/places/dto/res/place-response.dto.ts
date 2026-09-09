import {
    PlaceExternalProvider,
    PlaceStatus,
  } from '@prisma/client';
  
  export class PlaceCategoryResponseDto {
    id!: string;
    parentId!: string | null;
  
    key!: string;
    nameKo!: string;
    nameEn!: string | null;
  }
  
  export class PlaceExternalSourceResponseDto {
    id!: string;
  
    provider!: PlaceExternalProvider;
    externalId!: string;
    externalType!: string | null;
  
    sourceUpdatedAt!: Date | null;
    syncedAt!: Date | null;
  }
  
  export class PlaceResponseDto {
    id!: string;
  
    name!: string;
  
    address!: string | null;
    postalCode!: string | null;
  
    latitude!: number | null;
    longitude!: number | null;
  
    businessNumber!: string | null;
  
    phone!: string | null;
    websiteUrl!: string | null;
    description!: string | null;
  
    operationInfo!: unknown;
    priceInfo!: unknown;
  
    status!: PlaceStatus;
  
    archivedAt!: Date | null;
    archiveReason!: string | null;
  
    category!: PlaceCategoryResponseDto | null;
  
    externalSources!: PlaceExternalSourceResponseDto[];
  
    createdAt!: Date;
    updatedAt!: Date;
  }
  
  export interface PlaceListResponseDto {
    items: PlaceResponseDto[];
  
    page: number;
    limit: number;
    total: number;
  }

  //rawData는 내부 동기화 및 추적용. 클라이언트가 의존해야 하는 필드가 아님.