import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { MenusRepository } from './menus.repository.interface';

@Injectable()
export class MenusPrismaRepository implements MenusRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: {
    place_id: string;
    name: string;
    reference_image_url: string;
    portion_grams?: number;
  }) {
    return this.prisma.menu.create({
      data: input,
      select: {
        id: true,
        place_id: true,
        name: true,
        reference_image_url: true,
        portion_grams: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async update(
    menu_id: string,
    input: { name?: string; reference_image_url?: string; portion_grams?: number | null },
  ) {
    const updated = await this.prisma.menu.updateMany({
      where: { id: menu_id },
      data: input,
    });
    if (updated.count === 0) {
      return null;
    }
    return this.prisma.menu.findUnique({
      where: { id: menu_id },
      select: {
        id: true,
        place_id: true,
        name: true,
        reference_image_url: true,
        portion_grams: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  findMany(query: { place_id?: string }) {
    return this.prisma.menu.findMany({
      where: { place_id: query.place_id },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        place_id: true,
        name: true,
        reference_image_url: true,
        portion_grams: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  findById(menu_id: string) {
    return this.prisma.menu.findUnique({
      where: { id: menu_id },
      select: {
        id: true,
        place_id: true,
        name: true,
        reference_image_url: true,
        portion_grams: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
}
