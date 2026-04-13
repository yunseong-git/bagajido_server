import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { MenusRepository } from './menus.repository.interface';

@Injectable()
export class MenusPrismaRepository implements MenusRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(menu_id: string) {
    return this.prisma.menu.findUnique({
      where: { id: menu_id },
      select: { id: true, store_id: true },
    });
  }
}
