import { Injectable } from '@nestjs/common';
import { MenusPrismaRepository } from './menus.repository';

@Injectable()
export class MenusService {
  constructor(private readonly menusRepository: MenusPrismaRepository) {}
}
