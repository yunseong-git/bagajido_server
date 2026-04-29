import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { StoresRepository } from './stores.repository.interface';

function num(d: Prisma.Decimal | null | undefined): number | null {
  if (d == null) return null;
  return Number(d);
}

@Injectable()
export class StoresPrismaRepository implements StoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWithLngLat(input: {
    place_id: string;
    owner_id: string;
    name: string;
    longitude: number;
    latitude: number;
  }): Promise<{ place_id: string }> {
    const lat = new Prisma.Decimal(input.latitude);
    const lng = new Prisma.Decimal(input.longitude);

    return await this.prisma.$transaction(async (tx) => {
      await tx.store.upsert({
        where: { place_id: input.place_id },
        create: {
          place_id: input.place_id,
          name: input.name,
          latitude: lat,
          longitude: lng,
        },
        update: {
          name: input.name,
          latitude: lat,
          longitude: lng,
        },
      });

      await tx.storeDetail.upsert({
        where: { place_id: input.place_id },
        create: {
          place_id: input.place_id,
          owner_id: input.owner_id,
        },
        update: {
          owner_id: input.owner_id,
        },
      });

      return { place_id: input.place_id };
    });
  }

  async findAll() {
    const rows = await this.prisma.store.findMany({
      orderBy: { created_at: 'desc' },
      include: { detail: true },
    });

    return rows.map((row) => {
      const { detail, ...core } = row;
      return {
        store: {
          ...core,
          latitude: num(core.latitude),
          longitude: num(core.longitude),
          avg_value_score: num(core.avg_value_score),
        },
        store_detail: detail,
      };
    });
  }

  /** `stores` 테이블에만 있는 통계·요약 컬럼 (구 store_stats 대체) */
  async findMetricsFromStores() {
    const rows = await this.prisma.store.findMany({
      orderBy: { name: 'asc' },
      select: {
        place_id: true,
        name: true,
        avg_value_score: true,
        review_count: true,
        like_count: true,
        pick_count: true,
        ai_summary_line: true,
      },
    });
    return rows.map((r) => ({
      place_id: r.place_id,
      name: r.name,
      avg_value_score: num(r.avg_value_score),
      review_count: r.review_count,
      like_count: r.like_count,
      pick_count: r.pick_count,
      ai_summary_line: r.ai_summary_line,
    }));
  }

  async findMetricsByPlaceIds(place_ids: string[]) {
    if (place_ids.length === 0) {
      return [];
    }
    const rows = await this.prisma.store.findMany({
      where: { place_id: { in: place_ids } },
      select: {
        place_id: true,
        name: true,
        avg_value_score: true,
        review_count: true,
        like_count: true,
        pick_count: true,
        ai_summary_line: true,
      },
    });

    const byId = new Map(
      rows.map((r) => [
        r.place_id,
        {
          place_id: r.place_id,
          name: r.name,
          avg_value_score: num(r.avg_value_score),
          review_count: r.review_count,
          like_count: r.like_count,
          pick_count: r.pick_count,
          ai_summary_line: r.ai_summary_line,
        },
      ]),
    );

    return place_ids
      .map((id) => byId.get(id))
      .filter((row): row is NonNullable<typeof row> => row != null);
  }

  async findById(place_id: string) {
    const row = await this.prisma.store.findUnique({
      where: { place_id },
      include: {
        detail: true,
        menus: true,
      },
    });

    if (!row) return null;

    const { detail, menus, ...rest } = row;
    return {
      store: {
        ...rest,
        latitude: num(rest.latitude),
        longitude: num(rest.longitude),
        avg_value_score: num(rest.avg_value_score),
        menus,
      },
      store_detail: detail,
    };
  }

  async findByName(name: string) {
    return this.prisma.$queryRaw`
      SELECT 
        s.place_id,
        s.name,
        s.longitude::float8 AS longitude,
        s.latitude::float8 AS latitude,
        s.avg_value_score,
        s.like_count,
        s.pick_count
      FROM stores s
      WHERE s.name ILIKE ${'%' + name + '%'}
    `;
  }

  async addLike(user_id: string, place_id: string): Promise<void> {
    await this.prisma.storeLike.create({
      data: { user_id, place_id },
    });
  }

  async removeLike(user_id: string, place_id: string): Promise<void> {
    await this.prisma.storeLike.deleteMany({
      where: { user_id, place_id },
    });
  }

  async findLikedStores(user_id: string) {
    return this.prisma.$queryRaw<
      {
        place_id: string;
        name: string;
        longitude: number;
        latitude: number;
        liked_at: Date;
        avg_value_score: string | null;
        review_count: number;
        like_count: number;
        pick_count: number;
      }[]
    >`
      SELECT
        s.place_id,
        s.name,
        s.longitude::float8 AS longitude,
        s.latitude::float8 AS latitude,
        sl.created_at AS liked_at,
        s.avg_value_score::text AS avg_value_score,
        s.review_count,
        s.like_count,
        s.pick_count
      FROM store_likes sl
      INNER JOIN stores s ON sl.place_id = s.place_id
      WHERE sl.user_id = ${user_id}::uuid
      ORDER BY sl.created_at DESC
    `;
  }

  async addPick(user_id: string, place_id: string): Promise<void> {
    await this.prisma.storePick.create({
      data: { user_id, place_id },
    });
  }

  async removePick(user_id: string, place_id: string): Promise<void> {
    await this.prisma.storePick.deleteMany({
      where: { user_id, place_id },
    });
  }

  async findPickedStores(user_id: string) {
    return this.prisma.$queryRaw<
      {
        place_id: string;
        name: string;
        longitude: number;
        latitude: number;
        picked_at: Date;
        avg_value_score: string | null;
        review_count: number;
        like_count: number;
        pick_count: number;
      }[]
    >`
      SELECT
        s.place_id,
        s.name,
        s.longitude::float8 AS longitude,
        s.latitude::float8 AS latitude,
        sp.created_at AS picked_at,
        s.avg_value_score::text AS avg_value_score,
        s.review_count,
        s.like_count,
        s.pick_count
      FROM store_picks sp
      INNER JOIN stores s ON sp.place_id = s.place_id
      WHERE sp.user_id = ${user_id}::uuid
      ORDER BY sp.created_at DESC
    `;
  }

  /** 개발용: users + owners + stores + store_details + likes/picks 시드 */
  async seedMockStores(): Promise<{
    place_ids: string[];
    user_ids: string[];
    owner_ids: string[];
    inserted_stores: number;
    inserted_users: number;
    inserted_owners: number;
  }> {
    const ownerSeeds = [
      {
        oauth_provider: 'mock',
        oauth_subject: 'mock-seed-owner-1',
        display_name: '목업 사장님 1',
        email: 'mock-owner-1@example.local',
        phone_number: '010-1111-2222',
      },
      {
        oauth_provider: 'mock',
        oauth_subject: 'mock-seed-owner-2',
        display_name: '목업 사장님 2',
        email: 'mock-owner-2@example.local',
        phone_number: '010-3333-4444',
      },
    ] as const;

    const userSeeds = [
      {
        oauth_provider: 'mock',
        oauth_subject: 'mock-seed-user-1',
        display_name: '목업 유저 1',
        email: 'mock-user-1@example.local',
        role: 'USER' as const,
      },
      {
        oauth_provider: 'mock',
        oauth_subject: 'mock-seed-user-2',
        display_name: '목업 유저 2',
        email: 'mock-user-2@example.local',
        role: 'ADMIN' as const,
      },
    ] as const;

    const [owner1, owner2, user1, user2] = await this.prisma.$transaction([
      this.prisma.owner.upsert({
        where: {
          oauth_provider_oauth_subject: {
            oauth_provider: ownerSeeds[0].oauth_provider,
            oauth_subject: ownerSeeds[0].oauth_subject,
          },
        },
        create: ownerSeeds[0],
        update: {
          display_name: ownerSeeds[0].display_name,
          email: ownerSeeds[0].email,
          phone_number: ownerSeeds[0].phone_number,
        },
      }),
      this.prisma.owner.upsert({
        where: {
          oauth_provider_oauth_subject: {
            oauth_provider: ownerSeeds[1].oauth_provider,
            oauth_subject: ownerSeeds[1].oauth_subject,
          },
        },
        create: ownerSeeds[1],
        update: {
          display_name: ownerSeeds[1].display_name,
          email: ownerSeeds[1].email,
          phone_number: ownerSeeds[1].phone_number,
        },
      }),
      this.prisma.user.upsert({
        where: {
          oauth_provider_oauth_subject: {
            oauth_provider: userSeeds[0].oauth_provider,
            oauth_subject: userSeeds[0].oauth_subject,
          },
        },
        create: userSeeds[0],
        update: {
          display_name: userSeeds[0].display_name,
          email: userSeeds[0].email,
          role: userSeeds[0].role,
        },
      }),
      this.prisma.user.upsert({
        where: {
          oauth_provider_oauth_subject: {
            oauth_provider: userSeeds[1].oauth_provider,
            oauth_subject: userSeeds[1].oauth_subject,
          },
        },
        create: userSeeds[1],
        update: {
          display_name: userSeeds[1].display_name,
          email: userSeeds[1].email,
          role: userSeeds[1].role,
        },
      }),
    ]);

    const mocks: {
      place_id: string;
      name: string;
      category: string;
      lat: number;
      lng: number;
      avg: string;
      review_count: number;
      like_count: number;
      pick_count: number;
      ai_summary_line: string;
      owner_id: string;
      address: string;
      contact_number: string;
      opening_hours: string;
      description: string;
    }[] = [
      {
        place_id: 'mock_seoul_gangnam_1',
        name: '바가지도 테스트 떡볶이',
        category: '분식',
        lat: 37.498,
        lng: 127.028,
        avg: '4.20',
        review_count: 12,
        like_count: 30,
        pick_count: 8,
        ai_summary_line: '가성비 좋은 분식집으로 요약됩니다.',
        owner_id: owner1.id,
        address: '서울특별시 강남구 테헤란로 123',
        contact_number: '02-1234-5678',
        opening_hours: '월-일 11:00-22:00',
        description: '목업 데이터입니다. 매콤달콤 떡볶이 전문.',
      },
      {
        place_id: 'mock_seoul_hongdae_2',
        name: '홍대 김치찌개 목업',
        category: '한식',
        lat: 37.5563,
        lng: 126.9236,
        avg: '3.80',
        review_count: 5,
        like_count: 14,
        pick_count: 3,
        ai_summary_line: '든든한 한 끼에 적합합니다.',
        owner_id: owner1.id,
        address: '서울특별시 마포구 양화로 45',
        contact_number: '02-2345-6789',
        opening_hours: '월-토 10:00-21:00',
        description: '목업 김치찌개 집입니다.',
      },
      {
        place_id: 'mock_seoul_jamsil_3',
        name: '잠실 카페 목업',
        category: '카페',
        lat: 37.5133,
        lng: 127.1028,
        avg: '4.50',
        review_count: 20,
        like_count: 50,
        pick_count: 12,
        ai_summary_line: '디저트와 음료가 인기입니다.',
        owner_id: owner2.id,
        address: '서울특별시 송파구 올림픽로 300',
        contact_number: '02-3456-7890',
        opening_hours: '매일 08:00-23:00',
        description: '목업 카페 - 디저트 플레이트 추천.',
      },
      {
        place_id: 'mock_seoul_seongsu_4',
        name: '성수 브런치 목업',
        category: '양식',
        lat: 37.5445,
        lng: 127.0557,
        avg: '4.10',
        review_count: 17,
        like_count: 27,
        pick_count: 9,
        ai_summary_line: '브런치 메뉴가 다양하고 매장이 쾌적합니다.',
        owner_id: owner2.id,
        address: '서울특별시 성동구 연무장길 88',
        contact_number: '02-4567-8901',
        opening_hours: '매일 09:00-20:00',
        description: '브런치 및 커피 중심 목업 매장.',
      },
      {
        place_id: 'mock_seoul_itaewon_5',
        name: '이태원 버거 목업',
        category: '패스트푸드',
        lat: 37.5346,
        lng: 126.9945,
        avg: '3.90',
        review_count: 11,
        like_count: 21,
        pick_count: 6,
        ai_summary_line: '수제 버거와 감자튀김 조합이 인기입니다.',
        owner_id: owner1.id,
        address: '서울특별시 용산구 이태원로 200',
        contact_number: '02-5678-9012',
        opening_hours: '매일 11:30-22:30',
        description: '수제 버거 중심 목업 매장.',
      },
    ];

    const place_ids: string[] = [];
    for (const m of mocks) {
      await this.prisma.store.upsert({
        where: { place_id: m.place_id },
        create: {
          place_id: m.place_id,
          name: m.name,
          category: m.category,
          latitude: new Prisma.Decimal(m.lat),
          longitude: new Prisma.Decimal(m.lng),
          avg_value_score: new Prisma.Decimal(m.avg),
          review_count: m.review_count,
          like_count: m.like_count,
          pick_count: m.pick_count,
          ai_summary_line: m.ai_summary_line,
        },
        update: {
          name: m.name,
          category: m.category,
          latitude: new Prisma.Decimal(m.lat),
          longitude: new Prisma.Decimal(m.lng),
          avg_value_score: new Prisma.Decimal(m.avg),
          review_count: m.review_count,
          like_count: m.like_count,
          pick_count: m.pick_count,
          ai_summary_line: m.ai_summary_line,
        },
      });

      await this.prisma.storeDetail.upsert({
        where: { place_id: m.place_id },
        create: {
          place_id: m.place_id,
          owner_id: m.owner_id,
          address: m.address,
          contact_number: m.contact_number,
          opening_hours: m.opening_hours,
          description: m.description,
        },
        update: {
          owner_id: m.owner_id,
          address: m.address,
          contact_number: m.contact_number,
          opening_hours: m.opening_hours,
          description: m.description,
        },
      });

      place_ids.push(m.place_id);
    }

    const interactions = [
      { user_id: user1.id, place_id: mocks[0].place_id, like: true, pick: true },
      { user_id: user1.id, place_id: mocks[1].place_id, like: true, pick: false },
      { user_id: user1.id, place_id: mocks[2].place_id, like: false, pick: true },
      { user_id: user2.id, place_id: mocks[2].place_id, like: true, pick: true },
      { user_id: user2.id, place_id: mocks[3].place_id, like: true, pick: false },
      { user_id: user2.id, place_id: mocks[4].place_id, like: false, pick: true },
    ] as const;

    for (const it of interactions) {
      if (it.like) {
        await this.prisma.storeLike.upsert({
          where: {
            user_id_place_id: {
              user_id: it.user_id,
              place_id: it.place_id,
            },
          },
          create: { user_id: it.user_id, place_id: it.place_id },
          update: {},
        });
      }
      if (it.pick) {
        await this.prisma.storePick.upsert({
          where: {
            user_id_place_id: {
              user_id: it.user_id,
              place_id: it.place_id,
            },
          },
          create: { user_id: it.user_id, place_id: it.place_id },
          update: {},
        });
      }
    }

    return {
      place_ids,
      user_ids: [user1.id, user2.id],
      owner_ids: [owner1.id, owner2.id],
      inserted_stores: place_ids.length,
      inserted_users: 2,
      inserted_owners: 2,
    };
  }
}
