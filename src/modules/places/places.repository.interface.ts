import {
    Place,
    PlaceCategory,
    PlaceExternalProvider,
    PlaceStatus,
    Prisma,
  } from '@prisma/client';
  
  export interface CreateCategoryInput {
    key: string;
    nameKo: string;
    nameEn?: string;
    parentId?: string;
  }
  
  export interface CreateExternalSourceInput {
    provider: PlaceExternalProvider;
    externalId: string;
    externalType?: string;
  
    sourceUpdatedAt?: Date;
  
    rawData?: Prisma.InputJsonValue;
  }
  
  export interface CreatePlaceInput {
    categoryId?: string;
  
    name: string;
  
    normalizedName: string;
  
    address?: string;
    normalizedAddress?: string;
  
    postalCode?: string;
  
    latitude?: number;
    longitude?: number;
  
    businessNumber?: string;
  
    phone?: string;
    websiteUrl?: string;
    description?: string;
  
    operationInfo?: Prisma.InputJsonValue;
    priceInfo?: Prisma.InputJsonValue;
  
    externalSource?: CreateExternalSourceInput;
  }
  
  export interface UpdatePlaceInput {
    categoryId?: string | null;
  
    name?: string;
    normalizedName?: string;
  
    address?: string | null;
    normalizedAddress?: string | null;
  
    postalCode?: string | null;
  
    latitude?: number | null;
    longitude?: number | null;
  
    businessNumber?: string | null;
  
    phone?: string | null;
    websiteUrl?: string | null;
    description?: string | null;
  
    operationInfo?:
      | Prisma.InputJsonValue
      | typeof Prisma.JsonNull;
  
    priceInfo?:
      | Prisma.InputJsonValue
      | typeof Prisma.JsonNull;
  }
  
  export interface FindPlacesInput {
    query?: string;
    categoryId?: string;
    status: PlaceStatus;
  
    page: number;
    limit: number;
  }
  
  export interface PlacesRepository {
    findCategoryById(
      id: string,
    ): Promise<PlaceCategory | null>;
  
    findCategoryByKey(
      key: string,
    ): Promise<PlaceCategory | null>;
  
    findCategories(): Promise<PlaceCategory[]>;
  
    createCategory(
      input: CreateCategoryInput,
    ): Promise<PlaceCategory>;
  
    findPlaceById(
      id: string,
    ): Promise<any | null>;
  
    findPlaces(
      input: FindPlacesInput,
    ): Promise<{
      items: any[];
      total: number;
    }>;
  
    createPlace(
      input: CreatePlaceInput,
    ): Promise<any>;
  
    updatePlace(
      id: string,
      input: UpdatePlaceInput,
    ): Promise<any>;
  
    archivePlace(
      id: string,
      reason?: string,
    ): Promise<any>;
  
    restorePlace(
      id: string,
    ): Promise<any>;
  
    createExternalSource(
      placeId: string,
      input: CreateExternalSourceInput,
    ): Promise<any>;
  }

  //여기서 any는 개선 가능하지만, 우선 Prisma의 복잡한 include 반환 타입 때문에 Repository 인터페이스를 지나치게 복잡하게 만들지는 말자.
  //원하면 다음 리팩터링에서 Prisma.PlaceGetPayload<> 타입으로 정확하게 잡으면 돼.