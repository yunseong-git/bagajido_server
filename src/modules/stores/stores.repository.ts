import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { StoresRepository } from './stores.repository.interface';

@Injectable()
export class StoresPrismaRepository implements StoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createWithLngLat(input: {
    owner_id: string;
    name: string;
    longitude: number;
    latitude: number;
  }): Promise<{ id: string }> {
    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
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
    const row = rows[0];
    if (!row) {
      throw new Error('Failed to insert store');
    }
    return { id: row.id };
  }

  async findById(id: string) {
    return this.prisma.store.findUnique({ where: { id } });
  }
}
