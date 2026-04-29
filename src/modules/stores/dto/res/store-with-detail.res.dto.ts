import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** `stores` 테이블: 지도/목록용 요약 + 통계(구 store_stats 컬럼 통합) */
export class StoreCoreResponseDto {
  @ApiProperty()
  place_id!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  category?: string | null;

  @ApiPropertyOptional({ nullable: true })
  latitude?: number | null;

  @ApiPropertyOptional({ nullable: true })
  longitude?: number | null;

  @ApiPropertyOptional({ nullable: true })
  avg_value_score?: number | null;

  @ApiProperty()
  review_count!: number;

  @ApiProperty()
  like_count!: number;

  @ApiProperty()
  pick_count!: number;

  @ApiPropertyOptional({ nullable: true })
  ai_summary_line?: string | null;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiPropertyOptional({ description: '상세 조회 시에만 포함 (menus 테이블)' })
  menus?: unknown[];
}

/** `store_details` 테이블: 주소·연락처 등 상세 */
export class StoreDetailBlockDto {
  @ApiProperty()
  place_id!: string;

  @ApiPropertyOptional({ nullable: true })
  owner_id?: string | null;

  @ApiPropertyOptional({ nullable: true })
  address?: string | null;

  @ApiPropertyOptional({ nullable: true })
  contact_number?: string | null;

  @ApiPropertyOptional({ nullable: true })
  opening_hours?: string | null;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;
}

export class StoreWithDetailResponseDto {
  @ApiProperty({ type: StoreCoreResponseDto })
  store!: StoreCoreResponseDto;

  @ApiPropertyOptional({ type: StoreDetailBlockDto, nullable: true })
  store_detail!: StoreDetailBlockDto | null;
}

/** GET /stores/metrics — `stores` 테이블의 통계 컬럼만 조회 */
export class StoreMetricsRowDto {
  @ApiProperty()
  place_id!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  avg_value_score?: number | null;

  @ApiProperty()
  review_count!: number;

  @ApiProperty()
  like_count!: number;

  @ApiProperty()
  pick_count!: number;

  @ApiPropertyOptional({ nullable: true })
  ai_summary_line?: string | null;
}

export class StoreMetricsListResponseDto {
  @ApiProperty({ type: [StoreMetricsRowDto] })
  items!: StoreMetricsRowDto[];
}

export class MockSeedResponseDto {
  @ApiProperty({ example: 5, description: '삽입/업데이트된 매장 수' })
  inserted_stores!: number;

  @ApiProperty({ example: 2, description: '삽입/업데이트된 유저 수' })
  inserted_users!: number;

  @ApiProperty({ example: 2, description: '삽입/업데이트된 오너 수' })
  inserted_owners!: number;

  @ApiProperty({ type: [String], example: ['mock_seoul_1'] })
  place_ids!: string[];

  @ApiProperty({ type: [String], example: ['uuid-user-1', 'uuid-user-2'] })
  user_ids!: string[];

  @ApiProperty({ type: [String], example: ['uuid-owner-1', 'uuid-owner-2'] })
  owner_ids!: string[];
}
