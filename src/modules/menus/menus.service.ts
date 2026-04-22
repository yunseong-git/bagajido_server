import { Injectable, NotFoundException } from '@nestjs/common';
import { MenusPrismaRepository } from './menus.repository';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { FindMenuQueryDto } from './dto/find-menu-query.dto';

@Injectable()
export class MenusService {
  constructor(private readonly menusRepository: MenusPrismaRepository) {}

  create(input: CreateMenuDto) {
    return this.menusRepository.create(input);
  }

  async update(menu_id: string, input: UpdateMenuDto) {
    const menu = await this.menusRepository.update(menu_id, input);
    if (!menu) {
      throw new NotFoundException('menu_not_found');
    }
    return menu;
  }

  async findOne(menu_id: string) {
    const menu = await this.menusRepository.findById(menu_id);
    if (!menu) {
      throw new NotFoundException('menu_not_found');
    }
    return menu;
  }

  findMany(query: FindMenuQueryDto) {
    return this.menusRepository.findMany(query);
  }
}
