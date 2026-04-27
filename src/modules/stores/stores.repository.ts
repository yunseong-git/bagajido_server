import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { StoresRepository } from './stores.repository.interface';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresPrismaRepository implements StoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findWithinBounds(bounds: { xmin: number; ymin: number; xmax: number; ymax: number }) {
    return this.prisma.$queryRaw<
      {
        id: string;
        name: string;
        longitude: number;
        latitude: number;
        avg_value_score: string | null;
        review_count: number | null;
        like_count: number;
        pick_count: number;
      }[]
    >`
      SELECT 
        s.id::text, 
        s.name, 
        ST_X(s.location::geometry) as longitude, 
        ST_Y(s.location::geometry) as latitude,
        ss.avg_value_score,
        ss.review_count,
        COALESCE(ss.like_count, 0)::int AS like_count,
        COALESCE(ss.pick_count, 0)::int AS pick_count
      FROM stores s
      LEFT JOIN store_stats ss ON s.id = ss.store_id
      WHERE s.location && ST_MakeEnvelope(${bounds.xmin}, ${bounds.ymin}, ${bounds.xmax}, ${bounds.ymax}, 4326)
    `;
  }

  private resolveGridSizeByZoom(zoom: number): number {
    if (zoom <= 8) return 0.2;
    if (zoom <= 10) return 0.1;
    if (zoom <= 12) return 0.05;
    if (zoom <= 14) return 0.02;
    if (zoom <= 16) return 0.01;
    return 0.005;
  }

  async findMapItems(bounds: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
    zoom: number;
  }) {
    const gridSize = this.resolveGridSizeByZoom(bounds.zoom);
    return this.prisma.$queryRaw<
      {
        type: 'cluster' | 'store';
        store_id: string | null;
        name: string | null;
        longitude: number;
        latitude: number;
        count: number;
        avg_value_score: string | null;
        review_count: number | null;
        like_count: number | null;
        pick_count: number | null;
      }[]
    >`
      WITH filtered AS ( -- 이 괄호 안의 결과를 'filtered'라는 이름표를 붙여 임시로 저장해 둠
        SELECT
          s.id,
          s.name,
          ST_X(s.location::geometry) AS longitude,
          ST_Y(s.location::geometry) AS latitude,
          ss.avg_value_score,
          ss.review_count,
          COALESCE(ss.like_count, 0)::int AS like_count, -- COALESCE(값, 기본값) -> 값이 null이면 기본값으로 0을 반환
          COALESCE(ss.pick_count, 0)::int AS pick_count
        FROM stores s
        LEFT JOIN store_stats ss ON s.id = ss.store_id
        WHERE s.location && ST_MakeEnvelope(${bounds.xmin}, ${bounds.ymin}, ${bounds.xmax}, ${bounds.ymax}, 4326) -- 일단 현재 화면(네모 상자) 안에 있는 애들만 걸러냄 (findWithinBounds와 동일)
      ),
      clustered AS (
        SELECT
          FLOOR((longitude - ${bounds.xmin}) / ${gridSize})::int AS grid_x, //상점의 좌표를 gridSize로 나눈 후 소수점 버림(FLOOR)
          FLOOR((latitude - ${bounds.ymin}) / ${gridSize})::int AS grid_y,
          COUNT(*)::int AS cluster_count, //클러스터 내 상점 개수
          AVG(longitude)::float8 AS cluster_lng,
          AVG(latitude)::float8 AS cluster_lat,
          JSONB_AGG(
            JSONB_BUILD_OBJECT(
              'store_id', id::text,
              'name', name,
              'longitude', longitude,
              'latitude', latitude,
              'avg_value_score', avg_value_score,
              'review_count', review_count,
              'like_count', like_count,
              'pick_count', pick_count
            )
          ) AS members
        FROM filtered
        GROUP BY 1, 2
      )
      SELECT
        CASE WHEN c.cluster_count > 1 THEN 'cluster' ELSE 'store' END AS type,
        CASE WHEN c.cluster_count > 1 THEN NULL ELSE (c.members -> 0 ->> 'store_id') END AS store_id,
        CASE WHEN c.cluster_count > 1 THEN NULL ELSE (c.members -> 0 ->> 'name') END AS name,
        c.cluster_lng AS longitude,
        c.cluster_lat AS latitude,
        c.cluster_count AS count,
        CASE WHEN c.cluster_count > 1 THEN NULL ELSE (c.members -> 0 ->> 'avg_value_score') END AS avg_value_score,
        CASE WHEN c.cluster_count > 1 THEN NULL ELSE ((c.members -> 0 ->> 'review_count')::int) END AS review_count,
        CASE WHEN c.cluster_count > 1 THEN NULL ELSE ((c.members -> 0 ->> 'like_count')::int) END AS like_count,
        CASE WHEN c.cluster_count > 1 THEN NULL ELSE ((c.members -> 0 ->> 'pick_count')::int) END AS pick_count
      FROM clustered c
      ORDER BY count DESC, longitude ASC
    `;
  }

  async createWithLngLat(input: {
    owner_id: string;
    name: string;
    longitude: number;
    latitude: number;
  }): Promise<{ id: string }> {
    return await this.prisma.$transaction(async (tx) => {
      // 1. 상점 생성 (PostGIS 활용)
      const rows = await tx.$queryRaw<{ id: string }[]>`
        INSERT INTO stores (id, owner_id, name, location, created_at, updated_at)
        VALUES (
          gen_random_uuid(),
          ${input.owner_id}::uuid,
          ${input.name},
          ST_SetSRID(ST_MakePoint(${input.longitude}, ${input.latitude}), 4326),
          NOW(),
          NOW()
        )
        RETURNING id::text AS id
      `;
      //:: -> type변환
      //ST_MakePoint(경도,위도) -> 좌표생성
      //ST_SetSRID(좌표, 4326) -> 좌표 시스템 설정(4326이라는 전세계 표준 좌표계계)
      //RETURNING id::text AS id -> 데이터 삽입 후 백엔드 서비스에 id를 text로 반환환
      //id::text AS id -> id 타입 변환
      //pinecone(api_key=)
      
      const storeId = rows[0]?.id;
      if (!storeId) throw new Error('Failed to insert store');
  
      // 2. 상점 통계 테이블 초기화 (스키마 필드명에 정확히 맞춤)
      await tx.storeStat.create({
        data: {
          store_id: storeId,
          avg_value_score: "0.00", // Decimal 타입에 대응하는 초기값
          review_count: 0,
          like_count: 0,
          pick_count: 0,
          ai_summary_line: '아직 분석된 데이터가 없습니다.',
        },
      });
  
      return { id: storeId };
    });
  }

  async findAll() {
    return this.prisma.$queryRaw`
      SELECT 
        s.id::text, s.name, s.owner_id::text,
        ST_X(s.location::geometry) as longitude, 
        ST_Y(s.location::geometry) as latitude,
        ss.avg_value_score, ss.review_count,
        COALESCE(ss.like_count, 0)::int AS like_count,
        COALESCE(ss.pick_count, 0)::int AS pick_count,
        s.created_at
      FROM stores s
      LEFT JOIN store_stats ss ON s.id = ss.store_id
      ORDER BY s.created_at DESC
    `;
  }

  // 2. ID로 상세 조회 (메뉴까지 포함)
async findById(id: string) {
  // 상세조회는 Prisma의 include를 활용하면 편합니다. 
  // 단, location 필드는 raw query로 따로 가져오거나 제외해야 에러가 안 납니다.
  const store = await this.prisma.store.findUnique({
    where: { id },
    include: {
      store_stat: true,
      menus: true, // 메뉴 목록까지 한꺼번에!
    }
  });
  
  if (!store) return null;

  // 좌표 정보만 raw query로 살짝 보충해줍니다 (선택 사항)
  const coords = await this.prisma.$queryRaw<{lng: number, lat: number}[]>`
    SELECT ST_X(location::geometry) as lng, ST_Y(location::geometry) as lat 
    FROM stores WHERE id = ${id}::uuid
  `;

  return { ...store, longitude: coords[0]?.lng, latitude: coords[0]?.lat };
}

// 3. 이름 검색
async findByName(name: string) {
  return this.prisma.$queryRaw`
    SELECT 
      s.id::text, s.name,
      ST_X(s.location::geometry) as longitude, 
      ST_Y(s.location::geometry) as latitude,
      ss.avg_value_score,
      COALESCE(ss.like_count, 0)::int AS like_count,
      COALESCE(ss.pick_count, 0)::int AS pick_count
    FROM stores s
    LEFT JOIN store_stats ss ON s.id = ss.store_id
    WHERE s.name ILIKE ${'%' + name + '%'}
  `;
}

  async addLike(user_id: string, store_id: string): Promise<void> {
    await this.prisma.storeLike.create({
      data: { user_id, store_id },
    });
  }

  async removeLike(user_id: string, store_id: string): Promise<void> {
    await this.prisma.storeLike.deleteMany({
      where: { user_id, store_id },
    });
  }

  async findLikedStores(user_id: string) {
    return this.prisma.$queryRaw<
      {
        store_id: string;
        name: string;
        longitude: number;
        latitude: number;
        liked_at: Date;
        avg_value_score: string | null;
        review_count: number | null;
        like_count: number;
        pick_count: number;
      }[]
    >`
      SELECT
        s.id::text AS store_id,
        s.name,
        ST_X(s.location::geometry) as longitude,
        ST_Y(s.location::geometry) as latitude,
        sl.created_at AS liked_at,
        ss.avg_value_score::text,
        ss.review_count,
        COALESCE(ss.like_count, 0)::int AS like_count,
        COALESCE(ss.pick_count, 0)::int AS pick_count
      FROM store_likes sl
      INNER JOIN stores s ON sl.store_id = s.id
      LEFT JOIN store_stats ss ON ss.store_id = s.id
      WHERE sl.user_id = ${user_id}::uuid
      ORDER BY sl.created_at DESC
    `;
  }

  async addPick(user_id: string, store_id: string): Promise<void> {
    await this.prisma.storePick.create({
      data: { user_id, store_id },
    });
  }

  async removePick(user_id: string, store_id: string): Promise<void> {
    await this.prisma.storePick.deleteMany({
      where: { user_id, store_id },
    });
  }

  async findPickedStores(user_id: string) {
    return this.prisma.$queryRaw<
      {
        store_id: string;
        name: string;
        longitude: number;
        latitude: number;
        picked_at: Date;
        avg_value_score: string | null;
        review_count: number | null;
        like_count: number;
        pick_count: number;
      }[]
    >`
      SELECT
        s.id::text AS store_id,
        s.name,
        ST_X(s.location::geometry) as longitude,
        ST_Y(s.location::geometry) as latitude,
        sp.created_at AS picked_at,
        ss.avg_value_score::text,
        ss.review_count,
        COALESCE(ss.like_count, 0)::int AS like_count,
        COALESCE(ss.pick_count, 0)::int AS pick_count
      FROM store_picks sp
      INNER JOIN stores s ON sp.store_id = s.id
      LEFT JOIN store_stats ss ON ss.store_id = s.id
      WHERE sp.user_id = ${user_id}::uuid
      ORDER BY sp.created_at DESC
    `;
  }
}
